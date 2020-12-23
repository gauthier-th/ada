const fs = require('fs');
const request = require('request');
const { playSound } = require('./utils');

function stt(text, lastReadAudio = null, dontSave = false) {
	if (!text)
		return;
	if (!dontSave && lastReadAudio)
		lastReadAudio.unshift(text);
	return new Promise(resolve => {
		request('https://tts.gauthier-thomas.dev/?phrase=' + encodeURI(text) + (process.env.TTS_TOKEN ? '&token=' + encodeURI(process.env.TTS_TOKEN) : ''))
			.pipe(fs.createWriteStream('./tts-generated.wav'))
			.on('finish', () => {
				playSound('tts-generated.wav').then(() => {
					setTimeout(() => {
						fs.unlink('./tts-genrated.wav', resolve);
					}, 1000);
				})
			})
	});
}

module.exports = stt;