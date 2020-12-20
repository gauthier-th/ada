const winAudio = require('win-audio');
const mediaController = require('node-media-controller');


module.exports.pause = () => {
	mediaController.executeCommand('pause', () => {});
}
module.exports.play = () => {
	mediaController.executeCommand('play', () => {});
}
module.exports.next = () => {
	mediaController.executeCommand('next', () => {});
}
module.exports.previous = () => {
	mediaController.executeCommand('previous', () => {});
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
module.exports.mute = () => {
	winAudio.speaker.mute();
}
module.exports.unmute = () => {
	winAudio.speaker.unmute();
}