const request = require("request");
const { roundDate } = require('../utils');

function fetchWeather(city, cnt = 40, lang = 'fr') {
	return new Promise((resolve, reject) => {
		request(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHERMAP}&cnt=${cnt}&lang=${lang}`, (error, response, body) => {
			if (error)
				return reject(error);
			try {
				resolve(JSON.parse(body));
			}
			catch (e) {
				reject(e);
			}
		});
	})
}

async function tomorrowWeather(city, dayDate = new Date(Date.now() + 1000*60*60*24)) {
	dayDate = roundDate(dayDate);
	const weathers = await fetchWeather(city);
	const tomorrowWeathers = weathers.list.filter(weather => {
		const dt = new Date(weather.dt*1000);
		return (
			roundDate(dt).getDate() > (new Date(dayDate.getTime() - 1000*60*60*24)).getDate()
			&& roundDate(dt).getDate() < new Date(dayDate.getTime() + 1000*60*60*24).getDate()
			&& dt.getHours() >= 8
			&& dt.getHours() <= 20
		);
	});
	let weatherDesc = [];
	for (let weather of tomorrowWeathers) {
		weatherDesc.push(...weather.weather.map(w => w.description));
	}
	weatherDesc = [...new Set(weatherDesc)].map(w => w.replace(/pluie/gi, 'pluvieux').replace(/(léger|légère)/gi, 'légerement'));
	let desc = weatherDesc[0];
	if (weatherDesc.length > 1) {
		desc = weatherDesc.slice(0, -1).join(', ') + ' et ' + weatherDesc[weatherDesc.length - 1];
	}
	const temp = Math.round(tomorrowWeathers.map(weather => weather.main.temp).reduce((a, b) => a + b) / tomorrowWeathers.length) - 273;
	return `Demain il fera principalement ${desc}, avec une température moyenne de ${temp} degré.`;
}

module.exports = {
	tomorrowWeather
};