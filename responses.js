const { exec } = require('child_process');
const fs = require('fs');
const request = require('request');

function response(meaning) {
	console.log(meaning);
	if (meaning.type === 'GREETINGS_HOW_ARE_YOU') {
		readAudio('Merci, je vais bien et vous ?');
	}
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