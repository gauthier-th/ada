const path = require('path');
const express = require('express');
const request = require('request');
const { encodeBase64, jsonConfig } = require('../utils');

const router = express.Router();
const config = new jsonConfig(path.join(__dirname, '../configs/config.json'), { defaultConfigContent: path.join(__dirname, '../configs/default-config.json') });
config.read();

router.get('/', (req, res) => {
	res.render('spotify');
});
router.get('/error', (req, res) => {
	res.render('spotify', { callback: true, error: true });
});
router.get('/success', (req, res) => {
	res.render('spotify', { callback: true, error: false });
});
router.get('/connect', (req, res) => {
	const scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing';
	const redirect_uri = process.env.ROOT_URL + 'spotify/callback';
	const url = 'https://accounts.spotify.com/authorize?response_type=code&client_id=' + process.env.SPOTIFY_CLIENT_ID + (scopes ? '&scope=' + encodeURIComponent(scopes) : '') + '&redirect_uri=' + encodeURIComponent(redirect_uri)
	res.redirect(url);
});
router.get('/callback', (req, res) => {
	if (!req.query.code || req.query.error === 'access_denied')
		res.redirect('/spotify/error');
	else {
		const code = req.query.code;
		const redirect_uri = process.env.ROOT_URL + 'spotify/callback';
		request.post('https://accounts.spotify.com/api/token', {
			headers: {
				Authorization: 'Basic ' + encodeBase64(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET),
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `grant_type=authorization_code&code=${encodeURI(code)}&redirect_uri=${encodeURI(redirect_uri)}`
		}, (error, response, body) => {
			if (error)
				return res.redirect('/spotify/error');
			try {
				const result = JSON.parse(body);
				if (result.error)
					res.redirect('/spotify/error');
				else {
					config.json.spotify = {
						access_token: result.access_token,
						refresh_token: result.refresh_token
					};
					config.write();
					res.redirect('/spotify/success');
				}
			}
			catch (e) {
				console.error(e);
				res.redirect('/spotify/error');
			}
		});
	}
});

module.exports = router;