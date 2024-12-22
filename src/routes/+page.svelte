<script lang="ts">
	let text = $state('');
	let status = $state('');
	let statusInvalid = $state(false);
	let question = $state(
		'Tell me something (a quote) positive and inspirational in traditional inspirational quote with code. Give me only the quote and the author (if exists)'
	);

	async function resetData() {
		question = '';
		text = '';
		status = '';
		statusInvalid = false;
	}

	async function translateData(language: string) {
		const myquestion = `Help me to translate this text into ${language} language: \n${question}`;
		text = '';
		status = '';
		statusInvalid = false;
		askQuestion(myquestion);
	}

	async function reviewData() {
		const myquestion = `Help me to review this text in a better english form, provide me only the reviewed text: \n${question}`;
		text = '';
		status = '';
		statusInvalid = false;
		askQuestion(myquestion);
	}
	async function readData() {
		text = '';
		const myquestion = question;
		status = '';
		statusInvalid = false;
		askQuestion(myquestion);
	}

	async function askQuestion(myquestion: string) {
		try {
			if (question === '') {
				throw new Error('Question is empty');
			}
			const url = 'http://localhost:11434/api/generate';
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					model: 'llama3.2',
					prompt: myquestion
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
	<form>
		<div class="grid">
			<div>
				<textarea
					bind:value={question}
					name="question"
					placeholder="Write your question to Robertito AI"
					aria-label="Professional short bio"
					aria-invalid={statusInvalid}
					aria-describedby="invalid-helper"
				></textarea>
				<small id="invalid-helper">{status}</small>
			</div>
			<div>
				<textarea bind:value={text}></textarea>
			</div>
		</div>

		<div role="group">
			<button class="lg" onclick={() => resetData()}> Reset </button>
			<button class="lg" onclick={() => reviewData()}> Review the text </button>
			<button class="lg" onclick={() => translateData('Italian')}> Translate to 🇮🇹 </button>
			<button class="lg" onclick={() => translateData('English (British)')}>
				Translate to 🇬🇧
			</button>
			<button class="danger lg" onclick={() => readData()}> Ask me! </button>
		</div>
	</form>
</main>

<style>
	textarea {
		width: 100%;
		height: 40vh;
	}
</style>
