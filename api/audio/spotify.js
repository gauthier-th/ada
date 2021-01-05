require('dotenv').config();
const path = require('path');
const request = require('request');
const { jsonConfig, encodeBase64 } = require('../../utils');

const config = new jsonConfig(path.join(__dirname, '../../configs/config.json'), { defaultConfigContent: path.join(__dirname, '../../configs/default-config.json') });
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
			Authorization: 'Bearer ' + config.json.spotify.access_token,
			...(body && (method === 'POST' || method === 'PUT') ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {})
		},
		body: body || null
	}, (error, response, rBody) => {
		if (error)
			console.error(error);
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
function getVolume() {
	return new Promise(resolve => {
		spotifyRequest('https://api.spotify.com/v1/me/player', 'GET', null, null, res => {
			try {
				resolve(JSON.parse(res).device.volume_percent);
			}
			catch {
				resolve(50);
			}
		});
	});
}
function setVolume(percent) {
	return spotifyRequest('https://api.spotify.com/v1/me/player/volume?volume_percent=' + percent, 'PUT')
}



module.exports.volumeUp = async (count = 2) => {
	setVolume(Math.min((await getVolume()) + count, 100));
}
module.exports.volumeDown = async (count = 2) => {
	setVolume(Math.max((await getVolume()) - count, 0));
}
module.exports.setVolume = (count) => {
	setVolume(count);
}
module.exports.mute = () => {
	setVolume(0);
}
module.exports.unmute = () => {
	setVolume(50);
}


function spotifySearch(query, type = 'track') {
	return new Promise(resolve => {
		spotifyRequest(`https://api.spotify.com/v1/search?type=${type}&q=${encodeURIComponent(query.toLowerCase())}`, 'GET', null, null, res => {
			const json = JSON.parse(res);
			resolve(json);
		});
	})
}

module.exports.musicQuery = async (query) => {
	if (query.match(/^du /i)) { // only artist
		const artist = query.replace(/^du /i, '');
		const search = await spotifySearch(`artist:"${artist}"`, 'track');
		spotifyRequest('https://api.spotify.com/v1/me/player/queue?uri=' + encodeURIComponent(search.artists.items[0].uri), 'POST', null, null, () => {
			module.exports.next();
		});
	}
	else {
		let search;
		if (query.match(/ de ((.+ ?){1,5})$/i)) {
			const title = query.replace(/ de ((.+ ?){1,5})$/i, '');
			const artist = query.match(/ de ((.+ ?){1,5})$/i)[1];
			search = await spotifySearch(`${title} artist:"${artist}"`);
		}
		else
			search = await spotifySearch(query);
		spotifyRequest('https://api.spotify.com/v1/me/player/queue?uri=' + encodeURIComponent(search.tracks.items[0].uri), 'POST', null, null, () => {
			module.exports.next();
		});
	}
}