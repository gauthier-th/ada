const audioPlayer = require('./windows');
// const audioPlayer = require('./spotify');

module.exports.pause = () => {
	audioPlayer.pause();
}
module.exports.play = () => {
	audioPlayer.play();
}
module.exports.next = () => {
	audioPlayer.next();
}
module.exports.previous = () => {
	audioPlayer.previous();
}

module.exports.volumeUp = (count ) => {
	audioPlayer.volumeUp(count);
}
module.exports.volumeDown = (count) => {
	audioPlayer.volumeDown(count);
}
module.exports.setVolume = (count) => {
	audioPlayer.setVolume(count);
}
module.exports.mute = () => {
	audioPlayer.mute();
}
module.exports.unmute = () => {
	audioPlayer.unmute();
}