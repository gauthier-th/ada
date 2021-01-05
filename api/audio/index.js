const defautPlayer = 'windows';
const players = {
	windows: require('./windows'),
	spotify: require('./spotify')
}

module.exports.pause = (player = defautPlayer) => {
	players[player].pause();
}
module.exports.play = (player = defautPlayer) => {
	players[player].play();
}
module.exports.next = (player = defautPlayer) => {
	players[player].next();
}
module.exports.previous = (player = defautPlayer) => {
	players[player].previous();
}

module.exports.volumeUp = (count, player = defautPlayer) => {
	players[player].volumeUp(count);
}
module.exports.volumeDown = (count, player = defautPlayer) => {
	players[player].volumeDown(count);
}
module.exports.setVolume = (count, player = defautPlayer) => {
	players[player].setVolume(count);
}
module.exports.mute = (player = defautPlayer) => {
	players[player].mute();
}
module.exports.unmute = (player = defautPlayer) => {
	players[player].unmute();
}

module.exports.musicQuery = (query, player = 'spotify') => {
	players[player].musicQuery(query);
}