const path = require('path');
const fs = require('fs');
const { playSound } = require('../../utils');
const stt = require('../../core/stt');

function animals(animal) {
	const soundPath = path.join(__dirname, animal.replace(/ /g, '-') + '.wav');
	if (fs.existsSync(soundPath))
		playSound(soundPath);
	else
	stt('Désolé, je ne connais pas cet animal.');
}
module.exports = animals;