import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands';

// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

async function createModel() {
	const recognizer = speechCommands.create(
		"BROWSER_FFT",
		undefined,
		__WEBSERVER_HOST__ + "hotword-model/model.json",
		__WEBSERVER_HOST__ + "hotword-model/metadata.json");

	await recognizer.ensureModelLoaded();

	return recognizer;
}

export async function registerHotword(callback = () => {}, onReady = () => {}, parameters = { treshold: 0.95, overlapFactor: 0.75 }) {
	const recognizer = await createModel();
	const classLabels = recognizer.wordLabels();

	let lastHotword = 0;
	let ready = false;

	recognizer.listen(result => {
		if (ready === false) {
			ready = true;
			onReady();
		}
		for (let i = 0; i < classLabels.length; i++) {
			if (classLabels[i] === __HOTWORD_NAME__ && result.scores[i].toFixed(2) > parameters.treshold && Date.now() - lastHotword > 1000) {
				lastHotword = Date.now();
				callback();
			}
		}
	}, {
		includeSpectrogram: true,
		probabilityThreshold: '0.75',
		invokeCallbackOnNoiseAndUnknown: true,
		overlapFactor: parameters.overlapFactor
	});
}