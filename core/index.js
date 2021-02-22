const path = require('path');
const readline = require('readline');
const winAudio = require('win-audio');
const webserver = require('../webserver');
const tts = require('./tts');
const meaning = require('../meaning');
const responses = require('./responses');
const { playSound } = require('../utils');

function coreFunction() {
	playSound(path.join(__dirname, '../core/notify.wav'));
	const volume = winAudio.speaker.get();
	setTimeout(() => {
		winAudio.speaker.set(Math.round(volume / 2));
	}, 700);
	console.log('Hotword detected, waiting for input...');
	tts().then(result => {
		winAudio.speaker.set(volume);
		console.log(result.text);
		const mean = meaning(result.text);
		responses(mean);
	}).catch(err => {
		console.error(err);
	});
}

module.exports = coreFunction;



const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

rl.on('line', (line) => {
	const mean = meaning(line);
	responses(mean);
});