const { removeAccents } = require('./utils');

const lastSentences = [];

function sentenceType(sentence, waitForResponse) {
	if (!sentence)
		return ['NOTHING', {}];
	sentence = removeAccents(sentence);
	if (sentence.match(/((est[- ]ce que |comment )?ca va|((tu|vous) vas|vas[- ](tu|vous)) bien|comment ((tu|vous) vas|vas[- ](tu|vous)))/i))
		return ['GREETINGS_HOW_ARE_YOU', {}];
	else if (sentence.match(/(((mets?|joue) la )?(musique|chanson) (suivante|prochaine|d[' ]apres)|prochaine (musique|chanson))/i))
		return ['MUSIC_NEXT', {}];
	else if (sentence.match(/(((mets?|joue) la )?(musique|chanson) (precedente?|d[' ]avant)|(musique|chanson) precedente?)/i))
		return ['MUSIC_PREVIOUS', {}];
	else if (sentence.match(/((mets?( sur)? )?pause|arrete la (musique|chanson))/i))
		return ['MUSIC_PAUSE', {}];
	else if (sentence.match(/((mets? )?play|(mets?|joue|rejoue) la (musique|chanson))/i))
		return ['MUSIC_PLAY', {}]
	else
		return ['UNKNOWN', {}];
}

function meaning(sentence, waitForResponse) {
	const [type, parameters] = sentenceType(sentence, waitForResponse);
	lastSentences.push({ type, parameters });
	return {
		type,
		parameters
	}
}

module.exports = meaning;