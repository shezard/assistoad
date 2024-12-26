<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import { abortQuestion, askQuestion } from '$lib/ollama';

	import statusState from '$lib/store/status.svelte';
	import ollamaState from '$lib/store/ollama.svelte';

	let { status, statusInvalid } = statusState;
	let { questions, responses } = ollamaState;

	async function resetData() {
		status = '';
		statusInvalid = false;
		questions = [''];
		responses = [];
		abortQuestion();
	}

	async function readData() {
		status = '';
		statusInvalid = false;
		try {
			askQuestion(
				questions[questions.length - 1],
				(chunk: string) => {
					responses = [
						...responses.slice(0, questions.length - 1),
						(responses[questions.length - 1] || '') + chunk
					];
					document
						.querySelector(`#response-${responses.length - 1}`)
						?.scrollIntoView(false);
				},
				() => {
					questions = [...questions, ''];
					setTimeout(() => {
						document
							.querySelector<HTMLTextAreaElement>(`#question-${questions.length - 1}`)
							?.focus();
						window.scrollTo(0, document.body.scrollHeight);
					}, 10);
				}
			);
		} catch (error: unknown) {
			if (error instanceof Error) {
				status = error.message;
				statusInvalid = true;
			} else {
				console.error('An unknown error occurred:', error);
			}
		}
	}

	function detectKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter' && e.ctrlKey) {
			readData();
		}
	}
</script>

<svelte:body onkeypress={detectKeyPress} />

<main class="container my-4">
	<div class="flex flex-col gap-2">
		<div class="flex flex-row items-center justify-items-center gap-2">
			<span class="text-2xl text-lime-200">Assistoad</span> 🍄 Your personnal assistant 🍄
			<span class="ml-auto">TODO SAVE / LOAD</span>
		</div>
		<small id="invalid-helper">{status}</small>

		{#each questions as _, i}
			<div class="border-l-2 border-blue-200">
				<Textarea
					id="question-{i}"
					bind:value={questions[i]}
					disabled={responses.length === questions.length}
					class="rounded-l-none"
				></Textarea>
			</div>

			{#if responses[i]}
				<div class="border-l-2 border-lime-200">
					<Textarea
						id="response-{i}"
						bind:value={responses[i]}
						disabled
						class="rounded-l-none"
					></Textarea>
				</div>
			{/if}
		{/each}

		<div>
			<Button onclick={() => resetData()}>Reset</Button>
			<Button onclick={() => readData()}>Ask me!</Button>
		</div>
	</div>
</main>
