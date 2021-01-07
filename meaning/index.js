const { removeAccents } = require('../utils');
const { isNumber, parseNumber } = require('../utils/numbers-parsing');

const lastSentences = [{ type: 'UNKNOWN', parameters: {} }];

const plugins = [
	require('./audio'),
	require('./music'),
	require('./tram'),
	require('./other')
];

function sentenceType(sentence, waitForResponse) {
	if (!sentence)
		return ['NOTHING', {}];
	sentence = removeAccents(sentence);
	let result;
	let match;
	for (let plugin of plugins) {
		match = plugin(sentence, lastSentences);
		if (match && (!result || !result.trust || !match.trust || match.trust > result.trust)) {
			result = match;
			break;
		}
	}
	if (result)
		return result;
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