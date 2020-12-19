require('dotenv').config();
const webserver = require('./webserver');
const { oneHotword } = require('./hotword');
const speech = require('./speech');
const meaning = require('./meaning');
const responses = require('./responses');

function coreFunction() {
	oneHotword(1).then(() => {
		console.log('Hotword detected, waiting for input...');
		speech().then(result => {
			console.log(result.text);
			const mean = meaning(result.text);
			responses(mean);
			coreFunction();
		}).catch(err => {
			console.error(err);
		});
	});
}
coreFunction();