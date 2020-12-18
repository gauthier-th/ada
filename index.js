require('dotenv').config();
const { oneHotword } = require('./hotword');
const speech = require('./speech');
const meaning = require('./meaning');
const responses = require('./responses');

oneHotword(1).then(() => {
	console.log('Hotword detected, waiting for input...');
	speech().then(result => {
		console.log(result.text);
		const mean = meaning(result.text);
		responses(mean);
	}).catch(err => {
		console.error(err);
	});
});