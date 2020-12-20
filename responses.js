const fs = require('fs');
const request = require('request');
const { playSound, randomItem } = require('./utils');

const audioApi = require('./api/audio');
const tramApi = require('./api/tram');

function response(meaning) {
	console.log(meaning);
	if (meaning.type === 'GREETINGS_HOW_ARE_YOU')
		readAudio(randomItem(['Merci, je vais bien et vous ?', 'Je me porte à merveille, et vous ?', 'Tout va bien, et vous ?']));
	else if (meaning.type === 'GREETINGS_HELLO') {
		if ((new Date()).getHours() >= 18)
			readAudio(randomItem(['Bonsoir, comment allez-vous ?', 'Bonsoir, allez-vous bien ?']));
		else
			readAudio(randomItem(['Bonjour, comment allez-vous ?', 'Bonjour, allez-vous bien ?']));
	}
	else if (meaning.type === 'GREETINGS_RESPONSE_GOOD')
		readAudio(randomItem(['Je suis heureuse de l\'apprendre.', 'Vous m\'en voyez ravie.', 'Très bien.']));
	else if (meaning.type === 'GREETINGS_RESPONSE_BAD')
		readAudio(randomItem(['Oh, j\'en suis désolé.', 'Vous m\'en voyez navré.', 'Désolé de l\'apprendre']));
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
	else if (meaning.type === 'TRAM_PASSAGE')
		tramApi.nextPassage(meaning.parameters.direction).then(readAudio);
	else if (meaning.type === 'DISCUSSION_SHUT_UP')
		readAudio(randomItem(['Ok.', 'D\'accord.', 'Bien sûr.', 'Ça marche.', 'Comme vous voulez.']));
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
			.pipe(fs.createWriteStream('./tts-generated.wav'))
			.on('finish', () => {
				playSound('tts-generated.wav').then(() => {
					setTimeout(() => {
						fs.unlink('./tts-genrated.wav', () => {})
					}, 1000);
				})
			})
	});
}

module.exports = response;