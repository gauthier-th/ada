module.exports = (sentence) => {
	if (sentence.match(/(prochain passage du|((quand|quel) (passe|est) le|horaire du) prochain) (tram|train|tramway) (ver[st]|direction|pour) (.*)/i))
		return ['TRAM_PASSAGE', { direction: sentence.match(/(prochain passage du|((quand|quel) (passe|est) le|horaire du) prochain) (tram|train|tramway) (ver[st]|direction|pour) (.*)/i)[7] }];
}