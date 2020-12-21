const path = require('path');
const fs = require('fs');
const { playSound, readAudio } = require('../../utils');

function animals(animal) {
	const soundPath = path.join(__dirname, animal.replace(/ /g, '-') + '.wav');
	if (fs.existsSync(soundPath))
		playSound(soundPath);
	else
		readAudio('Désolé, je ne connais pas cet animal.');
}
module.exports = animals;