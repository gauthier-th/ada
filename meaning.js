const { removeAccents } = require('./utils');

function sentenceType(sentence) {
	sentence = removeAccents(sentence);
	if (sentence.match(/((est[- ]ce que |comment )?ca va|((tu|vous) vas|vas[- ](tu|vous)) bien|comment ((tu|vous) vas|vas[- ](tu|vous)))/i))
		return 'GREETINGS_HOW_ARE_YOU';
	else if (sentence.match(/(((met|joue) la )?(musique|chanson) (suivante|prochaine|d[' ]apres)|prochaine (musique|chanson))/i))
		return 'MUSIC_NEXT';
	else if (sentence.match(/(((met|joue) la )?(musique|chanson) (precedente?|d[' ]avant)|(musique|chanson) precedente?)/i))
		return 'MUSIC_PREVIOUS';
	else if (sentence.match(/((met( sur)? )?pause|arrete la (musique|chanson))/i))
		return 'MUSIC_PAUSE';
	else if (sentence.match(/((met )?play|(met|joue|rejoue) la (musique|chanson))/i))
		return 'MUSIC_PLAY'
}

function meaning(sentence) {
	const type = sentenceType(sentence);
	return {
		type,
		parameters: {}
	}
}

module.exports = meaning;