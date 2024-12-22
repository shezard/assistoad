<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";

	let text = $state('');
	let status = $state('');
	let statusInvalid = $state(false);
	let question = $state(
		'You are a DOOH specialist, looking to make a campaign from the following brief:\n\nI want to target french female shoppers going to Timesquare.\n\nCan you give me some recommandations ?'
	);

	async function resetData() {
		question = '';
		text = '';
		status = '';
		statusInvalid = false;
	}

	async function readData() {
		text = '';
		const prompt = question;
		status = '';
		statusInvalid = false;
		askQuestion(prompt);
	}

	async function askQuestion(prompt: string) {
		try {
			if (question === '') {
				throw new Error('Question is empty');
			}
			const url = 'http://localhost:11434/api/generate';
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					model: 'llama3.2',
					prompt: prompt
				})
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
					return;
				}
				const mystring = new TextDecoder().decode(value);
				const myresponse = JSON.parse(mystring);
				console.log(myresponse.response);
				text = text + myresponse.response;
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
</script>

<main class="container">
    <div class="grid gap-2">
        <div>
            Assistoad - 🍄 Your personnal assistant 🍄
        </div>
        <Textarea
            bind:value={question}
        ></Textarea>
        <small id="invalid-helper">{status}</small>

        <Textarea bind:value={text} disabled></Textarea>

        <div role="group">
            <Button onclick={() => resetData()}> Reset </Button>
            <Button onclick={() => readData()}> Ask me! </Button>
        </div>
    </div>

</main>
