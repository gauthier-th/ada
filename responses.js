const { exec } = require('child_process');
const fs = require('fs');
const request = require('request');

const audioApi = require('./api/audio');
const tramApi = require('./api/tram');

function response(meaning) {
	console.log(meaning);
	if (meaning.type === 'GREETINGS_HOW_ARE_YOU') {
		readAudio('merci, je vais bien et vous ?');
	}
	else if (meaning.type === 'MUSIC_PAUSE')
		audioApi.pause();
	else if (meaning.type === 'MUSIC_PLAY')
		audioApi.play();
	else if (meaning.type === 'MUSIC_NEXT')
		audioApi.next();
	else if (meaning.type === 'MUSIC_PREVIOUS')
		audioApi.previous();
	else if (meaning.type === 'AUDIO_UP')
		audioApi.volumeUp(meaning.parameters.count);
	else if (meaning.type === 'AUDIO_DOWN')
		audioApi.volumeDown(meaning.parameters.count);
	else if (meaning.type === 'AUDIO_SET')
		audioApi.setVolume(meaning.parameters.count);
	else if (meaning.type === 'AUDIO_MUTE')
		audioApi.mute();
	else if (meaning.type === 'AUDIO_UNMUTE')
		audioApi.unmute();
	else if (meaning.type == 'TRAM_PASSAGE') {
		tramApi.nextPassage(meaning.parameters.direction).then(readAudio);
	}
	else if (meaning.type === 'NOTHING') {
		// readAudio('Désolé, je n\'ai rien entendu.');
	}
	else
		readAudio('désolé, je n\'ai pas compris.');
}

function readAudio(text) {
	if (!text)
		return;
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