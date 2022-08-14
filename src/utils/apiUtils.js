const mysql = require("mysql");
const https = require("https");
const logger = require("../logger");
const Service = require("../services/Service");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

const getPool = () => pool;

const getUser = (accessToken) => new Promise(async (resolve, reject) => {
    https.get({
        headers: {'Authorization': 'Bearer ' + accessToken},
        host: 'api.spotify.com',
        port: 443,
        path: '/v1/me/'
    }, value => {
        if (value.statusCode !== 200) {
            return reject(Service.rejectResponse({
                title: 'Unauthorized',
                message: 'The given access token is invalid'
            }, 401));
        } else {
            let data = "";
            value.on('data', chunk => {
                data += String(chunk);
            });
            value.on('end', () => {
                try {
                    return resolve(JSON.parse(String(data)).id);
                } catch (e) {
                    logger.error(e.message);
                    return reject(Service.rejectResponse({title: 'Server Error', message: e.message}));
                }
            });
        }
    });
});


module.exports = {
    getPool,
    getUser
}