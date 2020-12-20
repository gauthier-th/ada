const winAudio = require('win-audio');
const audioPlayer = require('./spotify');

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

module.exports.volumeUp = (count = 2) => {
	winAudio.speaker.increase(count);
}
module.exports.volumeDown = (count = 2) => {
	winAudio.speaker.decrease(count);
}
module.exports.setVolume = (count) => {
	winAudio.speaker.set(count);
}