const path = require('path');
const winAudio = require('win-audio');
const request = require('request');
const { jsonConfig, encodeBase64 } = require('../../../utils');

const config = new jsonConfig(path.join(__dirname, '../../../config.json'), { defaultConfigContent: path.join(__dirname, '../../../default-config.json') });
config.read();

module.exports.pause = () => {
	spotifyRequest('https://api.spotify.com/v1/me/player/pause', 'PUT');
};
module.exports.play = () => {
	spotifyRequest('https://api.spotify.com/v1/me/player/play', 'PUT');
};
module.exports.next = () => {
	spotifyRequest('https://api.spotify.com/v1/me/player/next', 'POST');
};
module.exports.previous = () => {
	spotifyRequest('https://api.spotify.com/v1/me/player/previous', 'POST');
};

function spotifyRequest(url, method, headers, body, callback, _dontRepeat = false) {
	request(url, {
		method,
		headers: headers ? headers : {
			Authorization: 'Bearer ' + config.json.spotify.access_token
		},
		body
	}, (error, response, rBody) => {
		if (response.statusCode === 401 && !_dontRepeat) {
			spotifyRequest('https://accounts.spotify.com/api/token', 'POST', {
				Authorization: 'Basic ' + encodeBase64(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET),
				'Content-Type': 'application/x-www-form-urlencoded'
			}, 'grant_type=refresh_token&client_id=' + process.env.SPOTIFY_CLIENT_ID + '&refresh_token=' + encodeURI(config.json.spotify.refresh_token), (nBody) => {
				config.json.spotify.access_token = JSON.parse(nBody).access_token;
				config.write();
				spotifyRequest(url, method, headers, rBody, callback, true);
			});
		}
		else if (response.statusCode === 404)
			console.log('No active device connected to Spotify.');
		else if (callback)
			callback(rBody);
	});
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