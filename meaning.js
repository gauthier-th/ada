const { removeAccents } = require('./utils');
const { isNumber, parseNumber } = require('./utils/numbers-parsing');

const lastSentences = [{ type: 'UNKNOWN', parameters: {} }];

function sentenceType(sentence, waitForResponse) {
	if (!sentence)
		return ['NOTHING', {}];
	sentence = removeAccents(sentence);
	if (sentence.match(/(((mets?|joue) la )?(musique|chanson) (suivante|prochaine|d[' ]apres)|prochaine (musique|chanson))/i))
		return ['MUSIC_NEXT', {}];
	if (sentence.match(/(((re)?(mets?|joue) la )?(musique|chanson) (precedente?|d[' ]avant|au debut)|(musique|chanson) precedente?)/i))
		return ['MUSIC_PREVIOUS', {}];
	if (sentence.match(/((mets?( sur)? |mais )?pause|arrete la (musique|chanson))|[ml]'epouse/i))
		return ['MUSIC_PAUSE', {}];
	if (sentence.match(/((monte|augmente)( de (.+))? le (son|volume)( de (.+))?|(monte|augmente)( de (.+))? le (son|volume)( de (.+))?|(mets? |mais )?(de )?((.+) )?plus fort)/i)) {
		const match = sentence.match(/((monte|augmente)( de (.+))? le (son|volume)( de (.+))?|(monte|augmente)( de (.+))? le (son|volume)( de (.+))?|(mets? |mais )?(de )?((.+) )?plus fort)/i);
		const vol = match[4] || match[7] || match[10] || match[13] || match[17] || "";
		if (match && isNumber(vol.replace(/pour ?cents?/gi, '')))
			return ['AUDIO_UP', { count: parseNumber(vol.replace(/pour ?cents?/gi, '')) }];
		else
			return ['AUDIO_UP', {}];
	}
	if (sentence.match(/((descends?|reduit|baisse)( de (.*))? le (son|volume)( de (.*))?|(descends?|reduit|baisse)( de (.*))? le (son|volume)( de (.*))?|(mets? |mais )?(de )?((.+) )?moins fort)/i)) {
		const match = sentence.match(/((descends?|reduit|baisse)( de (.*))? le (son|volume)( de (.*))?|(descends?|reduit|baisse)( de (.*))? le (son|volume)( de (.*))?|(mets? |mais )?(de )?((.+) )?moins fort)/i);
		const vol = match[4] || match[7] || match[10] || match[13] || match[17] || "";
		if (match && isNumber(vol.replace(/pour ?cents?/gi, '')))
			return ['AUDIO_DOWN', { count: parseNumber(vol.replace(/pour ?cents?/gi, '')) }];
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
	if (sentence.match(/(chut|tais[- ]toi|ta gueule|ferme la)/i))
		return ['DISCUSSION_SHUT_UP', {}];
	if (sentence.match(/^ouvre/i)) {
		const app = sentence.match(/^ouvre (.*)/i)[1];
		return ['OPEN_APP', { app }];
	}
	if (sentence.match(/((re)?(met|mais|joue) (la (musique|chanson) (.+)|([dt]u .+))|joue (.+))/i)) {
		const match = sentence.match(/((re)?(met|mais|joue) (la (musique|chanson) (.+)|([dt]u .+))|joue (.+))/i);
		return ['MUSIC_QUERY', { query: match[6] || match[7] || match[8] }];
	}
	if (sentence.match(/((mets? |mais )?(play|plait)|(mets?|joue|rejoue) la (musique|chanson))/i))
		return ['MUSIC_PLAY', {}];
	if (sentence.match(/(re)?cherche (.+)( sur (google|bing|duck ?duck ?go|qwant|ecosia|youtube))/i)) {
		const match = sentence.match(/(re)?cherche (.+)( sur (google|bing|duck ?duck ?go|qwant|ecosia|youtube))/i);
		return ['WEB_SEARCH', { query: match[2], engine: match[4].replace(/\s+/g, '') || 'google' }];
	}
	if (sentence.match(/(raconte|dis)([- ]moi)? une ([\w-']+ ){0,3}(blague|plaisanterie|farce)/i))
		return ['DISCUSSION_JOKE', {}];
	if (sentence.match(/(fai[st]( le (bruit|son) de)? (l[ea] |l')(.*)|quel(le)? (bruit|son) fai[st] (l[ea] |l')(.*))/i)) {
		const match = sentence.match(/(fai[st] (l[ea] |l')(.*)|quel(le)? (bruit|son) fai[st] (l[ea] |l')(.*))/i);
		return ['ANIMAL', { animal: match[3] || match[5] || match[9] }];
	}
	if (sentence.match(/(meteo (a |de )?(.*)|quel temps( [\w-']+)* a (.*))/i)) {
		const match = sentence.match(/(meteo (a |de )?(.*)|quel temps( [\w-']+)* a (.*))/i);
		const day = sentence.match(/(^|\s)demain(\s|$)/i) || (new Date()).getHours() > 20 ? 'Demain' : 'Aujourd\'hui';
		const date = { 'Aujourd\'hui': new Date(), 'Demain': new Date(Date.now() + 1000*60*60*24) }[day];
		return ['WEATHER', { city: (match[3] || match[5]).replace(/(de )?demain|ajourd[ ']hui/, '').trim(), day, date }];
	}
	if (sentence.match(/(^|\s)meteo(\s|$)/i))
		return ['WEATHER', { city: null }];
	if ((lastSentences[0].type === 'GREETINGS_HOW_ARE_YOU' || lastSentences[0].type === 'GREETINGS_HELLO') && sentence.match(/(ca va|je (me (porte|sens)|vais) bien)/i))
		return ['GREETINGS_RESPONSE_GOOD', {}];
	if ((lastSentences[0].type === 'GREETINGS_HOW_ARE_YOU' || lastSentences[0].type === 'GREETINGS_HELLO') && sentence.match(/(ca (ne )? va pas|je (ne )? (me (porte|sens)|vais) (pas bien|mal))/i))
		return ['GREETINGS_RESPONSE_BAD', {}];
	if (sentence.match(/((est[- ]ce que |comment )?ca va|((tu|vous) (vas|allez)|(vas|allez)[- ](tu|vous)) bien|comment ((tu|vous|ca) (vas|allez)|(vas|allez)[- ](tu|vous)))/i))
		return ['GREETINGS_HOW_ARE_YOU', {}];
	if ((sentence.match(/((^|\s)comment(\s|$))/i) && sentence.match(/((^|\s)t'appelle(\s|$))/i)) || (sentence.match(/((^|\s)(quel est|c'est quoi)(\s|$))/i) && sentence.match(/((^|\s)ton (nom|prénom|blaze)(\s|$))/i)))
		return ['GREETINGS_NAME', {}];
	if (sentence.match(/^(repete|re ?di[st])/i))
		return ['REPEAT', {}];
	if (sentence.match(/^(encore|refais|une autre)$/i))
		return [lastSentences[0].type, lastSentences[0].parameters];
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