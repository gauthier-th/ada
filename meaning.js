const { removeAccents } = require('./utils');
const { isNumber, parseNumber } = require('./utils/numbers-parsing');

const lastSentences = [{ type: 'UNKNOWN', parameters: {} }];

function sentenceType(sentence, waitForResponse) {
	if (!sentence)
		return ['NOTHING', {}];
	sentence = removeAccents(sentence);
	if ((lastSentences[0].type === 'GREETINGS_HOW_ARE_YOU' || lastSentences[0].type === 'GREETINGS_HELLO') && sentence.match(/(ca va|je (me (porte|sens)|vais) bien)/i))
		return ['GREETINGS_RESPONSE_GOOD', {}];
	if ((lastSentences[0].type === 'GREETINGS_HOW_ARE_YOU' || lastSentences[0].type === 'GREETINGS_HELLO') && sentence.match(/(ca (ne )? va pas|je (ne )? (me (porte|sens)|vais) (pas bien|mal))/i))
		return ['GREETINGS_RESPONSE_BAD', {}];
	if (sentence.match(/((est[- ]ce que |comment )?ca va|((tu|vous) vas|vas[- ](tu|vous)) bien|comment ((tu|vous) vas|vas[- ](tu|vous)))/i))
		return ['GREETINGS_HOW_ARE_YOU', {}];
	if (sentence.match(/(((mets?|joue) la )?(musique|chanson) (suivante|prochaine|d[' ]apres)|prochaine (musique|chanson))/i))
		return ['MUSIC_NEXT', {}];
	if (sentence.match(/(((mets?|joue) la )?(musique|chanson) (precedente?|d[' ]avant)|(musique|chanson) precedente?)/i))
		return ['MUSIC_PREVIOUS', {}];
	if (sentence.match(/((mets?( sur)? |mais )?pause|arrete la (musique|chanson))|[ml]'epouse/i))
		return ['MUSIC_PAUSE', {}];
	if (sentence.match(/((mets? |mais )?(play|plait)|(mets?|joue|rejoue) la (musique|chanson))/i))
		return ['MUSIC_PLAY', {}];
	if (sentence.match(/((monte|augmente) le (son|volume) de (.*)|(monte|augmente) de (.*) le (son|volume))/i)) {
		const match = sentence.match(/((monte|augmente) le (son|volume) de (.*)|(monte|augmente) de (.*) le (son|volume))/i);
		if (match && isNumber((match[4] || match[6]).replace(/pour ?cents?/gi, '')))
			return ['AUDIO_UP', { count: parseNumber((match[4] || match[6]).replace(/pour ?cents?/gi, '')) }];
		else
			return ['AUDIO_UP', {}];
	}
	if (sentence.match(/((descends?|reduit|baisse) de (.*) le (son|volume)|(descends?|reduit|baisse) le (son|volume) de (.*))/i)) {
		const match = sentence.match(/((descends?|reduit|baisse) de (.*) le (son|volume)|(descends?|reduit|baisse) le (son|volume) de (.*))/i);
		if (match && isNumber((match[3] || match[7]).replace(/pour ?cents?/gi, '')))
			return ['AUDIO_DOWN', { count: parseNumber((match[3] || match[7]).replace(/pour ?cents?/gi, '')) }];
		else
			return ['AUDIO_DOWN', {}];
	}
	if (sentence.match(/((defini[st]?|met|change) le )?(son|volume) a (.*)/i)) {
		const match = sentence.match(/((definit|met|change) le )?(son|volume) a (.*)/i);
		if (isNumber(match[4].replace(/pour ?cents?/gi, '')))
			return ['AUDIO_SET', { count: parseNumber(match[4].replace(/pour ?cents?/gi, '')) }];
	}
	if (sentence.match(/((mets? )?(mute|muet)|(enleve|coupe|retire|arrete|desactive) le son)/i))
		return ['AUDIO_MUTE', {}];
	if (sentence.match(/((retire?|enleve|arrete) (mute|muet)|unmute|(remets?|active) le son)/i))
		return ['AUDIO_UNMUTE', {}];
	if (sentence.match(/(prochain passage du|((quand|quel) (passe|est) le|horaire du) prochain) (tram|train|tramway) (ver[st]|direction|pour) (.*)/i))
		return ['TRAM_PASSAGE', { direction: sentence.match(/(prochain passage du|((quand|quel) (passe|est) le|horaire du) prochain) (tram|train|tramway) (ver[st]|direction|pour) (.*)/i)[7] }];
	if (sentence.match(/(^|\s)(coucou|salut|bonjour|bonsoir|hi|hello|aie)($|\s)/i))
		return ['GREETINGS_HELLO', {}];
	if (sentence.match(/(chut|tais-toi|ta gueule|ferme la)/i))
		return ['DISCUSSION_SHUT_UP', {}];
	if (sentence.match(/^ouvre/i)) {
		const app = sentence.match(/^ouvre (.*)/i)[1];
		return ['OPEN_APP', { app }];
	}
	if (sentence.match(/recherche (.+)( sur (google|bing|duck ?duck ?go|qwant|ecosia|youtube))/i)) {
		const match = sentence.match(/recherche (.+)( sur (google|bing|duck duck go|qwant|youtube))/i);
		return ['WEB_SEARCH', { query: match[1], engine: match[3].replace(/\s+/g, '') || 'google' }];
	}
	if (sentence.match(/(raconte|dis)([- ]moi)? une (blague|plaisanterie|farce)/i))
		return ['DISCUSSION_JOKE', {}];
	return ['UNKNOWN', {}];
}

function meaning(sentence, waitForResponse) {
	const [type, parameters] = sentenceType(sentence, waitForResponse);
	lastSentences.unshift({ type, parameters });
	return {
		type,
		parameters
	}
}

module.exports = meaning;