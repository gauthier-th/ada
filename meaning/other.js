module.exports = (sentence) => {
	if (sentence.match(/(^|\s)(coucou|salut|bonjour|bonsoir|hi|hello|aie)($|\s)/i))
		return ['GREETINGS_HELLO', {}];
	if (sentence.match(/(chut|tais[- ]toi|ta gueule|ferme la)/i))
		return ['DISCUSSION_SHUT_UP', {}];
	if (sentence.match(/^ouvre/i)) {
		const app = sentence.match(/^ouvre (.*)/i)[1];
		return ['OPEN_APP', { app }];
	}
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
	if (sentence.match(/^(repete|re ?di[st])/i))
		return ['REPEAT', {}];
	if (sentence.match(/^(encore|refais|une autre)$/i))
		return [lastSentences[0].type, lastSentences[0].parameters];
}