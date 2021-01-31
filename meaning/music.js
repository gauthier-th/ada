module.exports = (sentence) => {
	if (sentence.match(/(((mets?|joue) la )?(musique|chanson) (suivante|prochaine|d[' ]apres)|prochaine (musique|chanson))/i))
		return ['MUSIC_NEXT', {}];
	if (sentence.match(/(((re)?(mets?|joue) la )?(musique|chanson) (precedente?|d[' ]avant|au debut)|(musique|chanson) precedente?)/i))
		return ['MUSIC_PREVIOUS', {}];
	if (sentence.match(/((mets?( sur)? |mais )?pause|arrete la (musique|chanson))|[ml]'epouse/i))
		return ['MUSIC_PAUSE', {}];
	if (sentence.match(/((re)?(mets?|mais|joue) (la (musique|chanson) (.+)|([dt]u .+))|joue (.+))/i)) {
		const match = sentence.match(/((re)?(mets?|mais|joue) (la (musique|chanson) (.+)|([dt]u .+))|joue (.+))/i);
		return ['MUSIC_QUERY', { query: match[6] || match[7] || match[8] }];
	}
	if (sentence.match(/((mets? |mais )?(play|plait)|(mets?|joue|rejoue) la (musique|chanson))/i))
		return ['MUSIC_PLAY', {}];
}