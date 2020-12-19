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