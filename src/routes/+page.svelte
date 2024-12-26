<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";

	let status = $state('');
	let statusInvalid = $state(false);
	let questions : string[] = $state(
        ['You are a DOOH specialist, looking to make a campaign from the following brief:\n\nI want to target french female shoppers going to Timesquare.\n\nCan you give me some recommandations ?']
	);
    let responses: string[] = $state([]);

    let aborter = new AbortController();

	async function resetData() {
		status = '';
		statusInvalid = false;
		questions = [''];
		responses = [];
        aborter?.abort();
        aborter = new AbortController();
	}

	async function readData() {
        status = '';
		statusInvalid = false;
		askQuestion(questions[questions.length - 1]);
	}

	async function askQuestion(prompt: string) {
		try {
			if (prompt === '') {
				throw new Error('Question is empty');
			}
			const url = 'http://localhost:11434/api/generate';
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					model: 'llama3.2',
					prompt: prompt
				}),
                signal: aborter.signal
			});
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
			}
			if (!response.body) {
				throw new Error('Readable stream not found in the response.');
			}
			const reader = response.body.getReader();
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					status = '';
					statusInvalid = false;
                    questions = [...questions, ''];
                    setTimeout(() => {
                        document.querySelector(`#question-${questions.length - 1}`)?.focus();
                        window.scrollTo(0, document.body.scrollHeight);
                    }, 10)
					return;
				}
				const apiResponse = new TextDecoder().decode(value);
				const parsedReponse = JSON.parse(apiResponse);
                responses = [
                    ...responses.slice(0, questions.length - 1),
                    (responses[questions.length -1] || '') + parsedReponse.response,
                ];
                document.querySelector(`#response-${responses.length - 1}`)?.scrollIntoView(false);
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				status = error.message;
				statusInvalid = true;
				console.error('An error occurred:', error.message);
			} else {
				console.error('An unknown error occurred:', error);
			}
		}
	}

    function detectKeyPress(e: KeyboardEvent) {
        if(e.key === 'Enter' && e.ctrlKey) {
            readData()
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
                        bind:value={responses[i]} disabled
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
