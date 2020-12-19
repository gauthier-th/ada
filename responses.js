const { exec } = require('child_process');
const fs = require('fs');
const request = require('request');

const audioApi = require('./api/audio');

function response(meaning) {
	console.log(meaning);
	if (meaning.type === 'GREETINGS_HOW_ARE_YOU') {
		readAudio('Merci, je vais bien et vous ?');
	}
	else if (meaning.type === 'MUSIC_PAUSE')
		audioApi.pause();
	else if (meaning.type === 'MUSIC_PLAY')
		audioApi.play();
	else if (meaning.type === 'MUSIC_NEXT')
		audioApi.next();
	else if (meaning.type === 'MUSIC_PREVIOUS')
		audioApi.previous();
	else if (meaning.type === 'NOTHING')
		readAudio('Désolé, je n\'ai rien entendu.');
	else
		readAudio('Désolé, je n\'ai pas compris.');
}

function readAudio(text) {
	return new Promise(resolve => {
		request('https://tts.gauthier-thomas.dev/?phrase=' + encodeURIComponent(text) + '&token=tts-token')
			.pipe(fs.createWriteStream('./generated.wav'))
			.on('finish', () => {
				exec('sox generated.wav -d', (err, stdout, stderr) => {
					resolve();
					setTimeout(() => {
						fs.unlink('./tts-genrated.wav', () => {})
					}, 1000);
				});
			})
	});
}

module.exports = response;