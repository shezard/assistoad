let questions = $state([
	//'You are a DOOH specialist, looking to make a campaign from the following brief:\n\nI want to target french female shoppers going to Timesquare.\n\nCan you give me some recommandations ?'
    `Given the following agents, described as json data:

    \`\`\`[{
        "name": "Wikipedia Url Finder",
        "mission": "You are an expert at finding the correct url of a given wikipedia topic. You answer with only the url. What is the wikipedia url for the page about \${prompt} ?",
    },
    {
        "name": "Wikipedia Summarizer",
        "mission": "Extract and summary the content from the following html: \${fetch(prompt)}",
    }]\`\`\`

    Help the user answer the following question:

    What is the average weihgt of a cat ?

    Do not provide directly the answer, instead, generate a list of step including the agent to call and a prompt that you will give to it.

    The answer must be of the form, only answer with the json code

    \`\`\`[{
        "name": "agent name",
        "prompt": "first step",
    },
    {
        "name": "other agent name",
        "mission": "second step",
    }]\`\`\`
    `
]);

let responses = $state([] as string[]);

export default {
	get questions() {
		return questions;
	},
	set questions(value) {
		questions = value;
	},
	get responses() {
		return responses;
	},
	set responses(value) {
		responses = value;
	}
};
