require('dotenv').config();
const readline = require('readline');
const webserver = require('./webserver');
const { oneHotword } = require('./hotword');
const speech = require('./speech');
const meaning = require('./meaning');
const responses = require('./responses');
const { playSound } = require('./utils');

function coreFunction() {
	oneHotword(1).then(() => {
		playSound('./notify.wav');
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



const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

rl.on('line', (line) => {
	const mean = meaning(line);
	responses(mean);
});