const rec = require('node-mic-record')
const request = require('request')

/**
 * Record and parse voice
 * @returns {Promise<object>}
 */
const recordSpeech = () => {
	return new Promise((resolve, reject) => {
		const recStream = rec.start();

		detectSilence(recStream, () => {
			rec.stop();
		}, process.env.SILENCES_COUNT);

		recStream.pipe(request.post({
			'url': 'https://api.wit.ai/speech?client=chromium&lang=fr-fr&output=json',
			'headers' : {
				'Accept': 'application/vnd.wit.stream+json',
				'Authorization': 'Bearer ' + process.env.API_KEY,
				'Content-Type': 'audio/wav'
			}
		}, (err, resp, body) => {
			if (err)
				reject(err);
			else {
				try {
					resolve(JSON.parse(body));
				}
				catch {
					reject('Unable to parse result.');
				}
			}
		}));
	});
};

module.exports = recordSpeech;


function detectSilence(stream, callback, silencesCount = 5) {
	let silences = 0;
	let startTime = Date.now();
	stream.on('data', chunk => {
		let speechSample;
		let silenceLength = 0;
		for (i=0; i<chunk.length; i=i+2) {
			if (chunk[i+1] > 128)
				speechSample = (chunk[i+1] - 256) * 256;
			else
				speechSample = chunk[i+1] * 256;
			speechSample += chunk[i];
			if (Math.abs(speechSample) > 2000) {
				silences = 0;
				break;
			}
			else
				silenceLength++;
		}
		if (silenceLength == chunk.length/2)
			silences++;
		if (silences >= silencesCount && Date.now() - startTime > 4000)
			callback();
	});
}