const { removeAccents } = require('./utils');
const { isNumber, parseNumber } = require('./utils/numbers-parsing');

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
	else if (sentence.match(/((mets?( sur)? |mais )?pause|arrete la (musique|chanson))|[ml]'epouse/i))
		return ['MUSIC_PAUSE', {}];
	else if (sentence.match(/((mets? |mais )?(play|plait)|(mets?|joue|rejoue) la (musique|chanson))/i))
		return ['MUSIC_PLAY', {}];
	else if (sentence.match(/(monte|augmente) le (son|volume)/i)) {
		const match = sentence.match(/(monte|augmente) le (son|volume) de (.*)/i);
		if (match && isNumber(match[3].replace(/pour ?cents?/gi, '')))
			return ['AUDIO_UP', { count: parseNumber(match[3].replace(/pour ?cents?/gi, '')) }];
		else
			return ['AUDIO_UP', {}];
	}
	else if (sentence.match(/(descends?|reduit|baisse) le (son|volume)/i)) {
		const match = sentence.match(/(descends?|reduit|baisse) le (son|volume) de (.*)/i);
		if (match && isNumber(match[3].replace(/pour ?cents?/gi, '')))
			return ['AUDIO_DOWN', { count: parseNumber(match[3].replace(/pour ?cents?/gi, '')) }];
		else
			return ['AUDIO_DOWN', {}];
	}
	else if (sentence.match(/((defini[st]?|met|change) le )?(son|volume) a (.*)/i)) {
		const match = sentence.match(/((definit|met|change) le )?(son|volume) a (.*)/i);
		if (isNumber(match[4].replace(/pour ?cents?/gi, '')))
			return ['AUDIO_SET', { count: parseNumber(match[4].replace(/pour ?cents?/gi, '')) }];
		else
			return ['UNKNOWN', {}];
	}
	else if (sentence.match(/((mets? )?(mute|muet)|(enleve|coupe|retire|arrete|desactive) le son)/i))
		return ['AUDIO_MUTE', {}];
	else if (sentence.match(/((retire?|enleve|arrete) (mute|muet)|unmute|(remets?|active) le son)/i))
		return ['AUDIO_UNMUTE', {}];
	else if (sentence.match(/(prochain passage du|((quand|quel) (passe|est) le|horaire du) prochain) (tram|train|tramway) (ver[st]|direction|pour) (.*)/i))
		return ['TRAM_PASSAGE', { direction: sentence.match(/(prochain passage du|((quand|quel) (passe|est) le|horaire du) prochain) (tram|train|tramway) (ver[st]|direction|pour) (.*)/i)[7] }];
	else if (sentence.match(/(^|\s)(coucou|salut|bonjour|bonsoir|hi|hello|aie)($|\s)/i))
		return ['GREETINGS_HELLO', {}]
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