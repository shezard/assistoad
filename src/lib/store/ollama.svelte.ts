let questions = $state([
	'You are a DOOH specialist, looking to make a campaign from the following brief:\n\nI want to target french female shoppers going to Timesquare.\n\nCan you give me some recommandations ?'
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
