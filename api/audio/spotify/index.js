const path = require('path');
const request = require('request');
const { jsonConfig } = require('../../../utils');

const config = new jsonConfig(path.join(__dirname, '../../../config.json'), { defaultConfigContent: path.join(__dirname, '../../../default-config.json') });
config.read();

module.exports.pause = () => {
	spotifyRequest('https://api.spotify.com/v1/me/player/pause', 'PUT');
};
module.exports.play = () => {
	spotifyRequest('https://api.spotify.com/v1/me/player/play', 'PUT');
};
module.exports.next = () => {
	spotifyRequest('https://api.spotify.com/v1/me/player/next', 'PUT');
};
module.exports.previous = () => {
	spotifyRequest('https://api.spotify.com/v1/me/player/previous', 'PUT');
};

function spotifyRequest(url, method, headers) {
	request(url, {
		method,
		headers: {
			Authorization: 'Bearer ' + config.json.spotify.access_token,
			...headers
		}
	});
}