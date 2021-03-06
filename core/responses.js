const { randomItem, shellCommand } = require('../utils');
const stt = require('./stt');

const audioApi = require('../api/audio');
const tramApi = require('../api/tram');
const apps = require('../configs/apps');
const jokes = require('../configs/jokes.json');
const animals = require('../api/animals');
const { weatherDesc } = require('../api/weather');

const lastReadAudio = [];
const readAudio = (text, dontSave) => stt(text, lastReadAudio, dontSave);

async function response(meaning) {
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
	else if (meaning.type === 'GREETINGS_NAME')
		readAudio(randomItem(['Je m\'appelle Ada.', 'Mon nom est Ada.', 'Mon prénom est Ada', 'Je me prénomme Ada.', 'Je me nomme Ada.']));
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
	else if (meaning.type === 'OPEN_APP') {
		for (let app of apps) {
			if (app.regex.exec(meaning.parameters.app))
				return shellCommand(app.command).catch(console.error);
		}
		readAudio('Désolé, je n\'ai pas trouvé l\'application.');
	}
	else if (meaning.type === 'WEB_SEARCH') {
		let url;
		if (meaning.parameters.engine === 'google')
			url = 'https://www.google.com/search?q=' + encodeURI(meaning.parameters.query);
		else if (meaning.parameters.engine === 'bing')
			url = 'https://www.bing.com/search?q=' + encodeURI(meaning.parameters.query);
		else if (meaning.parameters.engine === 'duckduckgo')
			url = 'https://duckduckgo.com/?q=' + encodeURI(meaning.parameters.query);
		else if (meaning.parameters.engine === 'qwant')
			url = 'https://www.qwant.com/?q=' + encodeURI(meaning.parameters.query);
		else if (meaning.parameters.engine === 'ecosia')
			url = 'https://www.ecosia.org/search?q=' + encodeURI(meaning.parameters.query);
		else if (meaning.parameters.engine === 'youtube')
			url = 'https://www.youtube.com/results?search_query=' + encodeURI(meaning.parameters.query);
		shellCommand('cmd /C start ' + url);
	}
	else if (meaning.type === 'DISCUSSION_JOKE') {
		const joke = randomItem(jokes);
		readAudio(joke.joke + '\n' + joke.answer);
	}
	else if (meaning.type === 'ANIMAL')
		animals(meaning.parameters.animal);
	else if (meaning.type === 'WEATHER') {
		if (!meaning.parameters.city)
			readAudio('Vous devez spécifier un nom de ville.');
		else
			readAudio(meaning.parameters.day + ', ' + await weatherDesc(meaning.parameters.city, meaning.parameters.date));
	}
	else if (meaning.type === 'MUSIC_QUERY')
		audioApi.musicQuery(meaning.parameters.query);
	else if (meaning.type === 'REPEAT') {
		if (lastReadAudio.length > 0)
			readAudio(lastReadAudio[0], true);
	}
	else if (meaning.type === 'NOTHING') {
		// readAudio('Désolé, je n\'ai rien entendu.');
	}
	else
		readAudio('Ddésolé, je n\'ai pas compris.');
}

module.exports = response;