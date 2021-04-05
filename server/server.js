const express = require('express');
const request = require('request');
const queryString = require('querystring');
const User = require('./models/user-model');
const randomString = require('randomstring');
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(cors({ origin: '*' }));

const server = app.listen(5000);
const http = require('http').createServer(app);

const redirect_uri = ''; //spotify oauth redirect url
const loggedInURI = ''; //redirect here if login successful
const loggedOutURI = ''; //redirect here if login failed

app.use(function(req, res, next) {
	// Website you wish to allow to connect
	res.header('Access-Control-Allow-Origin', 'http://localhost:5000');

	// Request methods you wish to allow
	res.header('Access-Control-Allow-Methods', 'GET, POST');

	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

//<--------------------------------------------------------------------------------------------Login System
//handles redirect user to spotify authentication login
app.get('/auth/login', (req, res) => {
	res.redirect(
		'https://accounts.spotify.com/authorize?' +
			queryString.stringify({
				response_type: 'code',
				client_id: process.env.SPOTIFY_CLIENT_ID,
				scope:
					'streaming user-modify-playback-state user-read-private playlist-read-private playlist-read-collaborative',
				redirect_uri
			})
	);
});

//handles spotify code -> auth token and return token to users browser
app.get('/auth/spotify/redirect', (req, res) => {
	//set variables
	let code = req.query.code;
	const authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri,
			grant_type: 'authorization_code'
		},
		headers: {
			Authorization:
				'Basic ' + new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
		},
		json: true
	};

	request.post(authOptions, (err, result, body) => {
		var access_token = body.access_token;

		request(
			{
				url: 'https://api.spotify.com/v1/me',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + access_token
				}
			},
			(err, result, body) => {
				res.redirect(loggedInURI + '?access_token=' + access_token);
			}
		);
	});
});