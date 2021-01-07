const { isNumber, parseNumber } = require('../utils/numbers-parsing');

module.exports = (sentence) => {
	if (sentence.match(/((montr?e|augmente)( de (.+))? le (son|volume)( de (.+))?|(montr?e|augmente)( de (.+))? le (son|volume)( de (.+))?|(mets? |mais )?(de )?((.+) )?plus fort)/i)) {
		const match = sentence.match(/((montr?e|augmente)( de (.+))? le (son|volume)( de (.+))?|(montr?e|augmente)( de (.+))? le (son|volume)( de (.+))?|(mets? |mais )?(de )?((.+) )?plus fort)/i);
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
}