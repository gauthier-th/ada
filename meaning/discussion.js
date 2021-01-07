module.exports = (sentence, lastSentences) => {
	if ((lastSentences[0].type === 'GREETINGS_HOW_ARE_YOU' || lastSentences[0].type === 'GREETINGS_HELLO') && sentence.match(/(ca va|je (me (porte|sens)|vais) bien)/i))
		return ['GREETINGS_RESPONSE_GOOD', {}];
	if ((lastSentences[0].type === 'GREETINGS_HOW_ARE_YOU' || lastSentences[0].type === 'GREETINGS_HELLO') && sentence.match(/(ca (ne )? va pas|je (ne )? (me (porte|sens)|vais) (pas bien|mal))/i))
		return ['GREETINGS_RESPONSE_BAD', {}];
	if (sentence.match(/((est[- ]ce que |comment )?ca va|((tu|vous) (vas|allez)|(vas|allez)[- ](tu|vous)) bien|comment ((tu|vous|ca) (vas|allez)|(vas|allez)[- ](tu|vous)))/i))
		return ['GREETINGS_HOW_ARE_YOU', {}];
	if ((sentence.match(/((^|\s)comment(\s|$))/i) && sentence.match(/((^|\s)t'appelle(\s|$))/i)) || (sentence.match(/((^|\s)(quel est|c'est quoi)(\s|$))/i) && sentence.match(/((^|\s)ton (nom|prénom|blaze)(\s|$))/i)))
		return ['GREETINGS_NAME', {}];
}