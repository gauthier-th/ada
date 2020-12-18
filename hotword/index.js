const path = require('path');
const exec = require('child_process').exec;

/**
 * Returns a promise when a hotword is detected
 * @param {number} sensivity 
 * @returns {Promise<any>}
 */
const oneHotword = (sensivity) => {
	return new Promise((resolve) => {
		const script = path.join(__dirname, 'main.py');
		const cmd = exec(`python ${script}${sensivity ? ' ' + sensivity : ''}`, err => {
			if (err)
				throw err;
		});
		cmd.stdout.on('data', data => {
			if (data === 'hotword') {
				resolve();
				cmd.stdout.destroy();
			}
		});
	});
}

/**
 * Trigger a callback when a hotword is detected
 * @param {number} sensivity 
 * @param {Function} callback 
 */
const multipleHotwords = (sensivity, callback) => {
	const script = path.join(__dirname, 'main.py');
	const cmd = exec(`python ${script}${sensivity ? ' ' + sensivity : ''} multiple`, err => {
		if (err)
			throw err;
	});
	cmd.stdout.on('data', data => {
		if (data === 'hotword')
			callback();
	});
}

module.exports = {
	oneHotword,
	multipleHotwords
};