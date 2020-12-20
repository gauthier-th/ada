const path = require('path');
const DiviaAPI = require('divia-api');
const { jsonConfig, removeAccents } = require('../utils');


const config = new jsonConfig(path.join(__dirname, '../config.json'), { defaultConfigContent: path.join(__dirname, '../default-config.json') });
config.read();

module.exports.nextPassage = async (direction) => {
	if (!config.json['divia-api'].defaultStop)
		return console.log('You must define a default tram stop.');
	const defaultStop = config.json['divia-api'].defaultStop;
	const lines = await DiviaAPI.listLines();
	const line = lines.find(l => l.name === defaultStop.lineName && l.terminus.toLowerCase().includes(direction.toLowerCase()));
	if (!line)
		return 'Ligne de tram introuvalble.';
	const stops = await line.listStops();
	const stop = stops.find(s => removeAccents(s.name.toLowerCase()) === removeAccents(defaultStop.stopName.toLowerCase()))
	const passages = await stop.getPassages();
	if (passages.length === 0)
		return 'Aucun passage du tram de prévu.';
	else
		return 'Le prochain passage du tram direction ' + passages[0].destination + ' à ' + stop.name + ' est à ' + passages[0].hour.replace(':', ' heure ');
}