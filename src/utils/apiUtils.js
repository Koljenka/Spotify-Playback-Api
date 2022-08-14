const mysql = require("mysql");
const https = require("https");
const logger = require("../logger");

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE
});

const getPool = () => pool;

const getUser = (accessToken, next) => {
	https.get({
		headers: {'Authorization': 'Bearer ' + accessToken},
		host: 'api.spotify.com',
		port: 443,
		path: '/v1/me/'
	}, value => {
		if (value.statusCode !== 200) {
			next({code: 401, content: 'Unauthorized'});
		} else {
			let data = "";
			value.on('data', chunk => {
				data += String(chunk);
			});
			value.on('end', () => {
				try {
					next({code: 200, content: JSON.parse(String(data)).id});
				} catch (e) {
					logger.error(e.message);
					next({code: 500, content: e.message})
				}
			});
		}
	});
}


module.exports = {
	getPool,
	getUser
}