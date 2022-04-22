const express = require('express');
const https = require("https");
const fs = require('fs');
const cors = require('cors')
const mysql = require('mysql');

const interceptor = express.Router();
const version = JSON.parse(fs.readFileSync('./package.json')).version

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE
});

const app = express();
interceptor.use(onIntercept);
app.use(cors()).use(express.json()).use(interceptor);

app.post('/history', (req, res) => {
	pool.query('SELECT DISTINCT trackid, contexturi, played_at FROM playback JOIN user ON userid = user.id WHERE sid = ? ORDER BY played_at DESC', [req.userId],
		(error, results) => {
			if (error) {
				res.json(error).status(500).end();
			}
			res.json(results).end();
		});
});

app.post('/topTrack', (req, res) => {
	pool.query(`SELECT DISTINCT playback.trackid, c
                FROM playback
                         JOIN user ON userid = user.id
                         JOIN track t on playback.trackid = t.id
                         JOIN (SELECT trackid, count(*) as c
                               FROM playback
                                        JOIN user ON userid = user.id
                               WHERE sid = ?
                               GROUP BY trackid
                               order by c desc) as count ON playback.trackid = count.trackid
                WHERE sid = ?
                ORDER BY c DESC
                LIMIT 50;`, [req.userId, req.userId],
		(error, results) => {
			if (error) {
				res.json(error).status(500).end();
			}
			res.json(results).end();
		});
});

app.post('/contextOfTrack', (req, res) => {
	const {track_id} = req.body;
	pool.query(`select distinct playback.trackid, playback.contexturi
                from playback
                         join user u on playback.userid = u.id
                where sid = ?
                  and trackid = ?
                order by trackid desc;`, [req.userId, track_id],
		(error, results) => {
			if (error) {
				res.json(error).status(500).end();
			}
			res.json(results).end();
		});
});


app.post('/listeningClock', (req, res) => {
	const {from, to} = req.body;
	pool.query(`select TIME_FORMAT(FROM_UNIXTIME(played_at), '%H') hour, count(*) as count
                from playback
                         join user u on playback.userid = u.id
                where sid = ?
                  and played_at >= ?
                  and played_at <= ?
                GROUP BY hour
                order by hour ASC;`, [req.userId, from, to],
		(error, results) => {
			if (error) {
				res.json(error).status(500).end();
			}
			res.json(results).end();
		});
});

app.post('/streak', (req, res) => {
	const {from, to} = req.body;
	pool.query(`SELECT consec_set id, MAX(start) start, MAX(end) end, (count(consec_set) - 1) days
                FROM (
                         SELECT IF(b.date IS NULL, @val := @val + 1, @val) AS consec_set,
                                IF(b.date IS NULL, a.date, null)           AS start,
                                IF(b.date IS NOT NULL, b.date, null)       AS end
                         FROM (select MAX(userid) userid, DATE(FROM_UNIXTIME(played_at)) date
                               from playback
                                        join user u on playback.userid = u.id
                               where sid = ?
                                 and played_at >= ?
                                 and played_at <= ?
                               GROUP BY date) a
                                  CROSS JOIN (SELECT @val := 0) var_init
                                  LEFT JOIN (select MAX(userid) userid, DATE(FROM_UNIXTIME(played_at)) date
                                             from playback
                                                      join user u on playback.userid = u.id
                                             where sid = ?
                                               and played_at >= ?
                                               and played_at <= ?
                                             GROUP BY date) b ON
                                 a.userid = b.userid AND
                                 a.date = b.date + INTERVAL 1 DAY
                     ) a
                GROUP BY a.consec_set
                ORDER BY days DESC;`, [req.userId, from, to, req.userId, from, to],
		(error, results) => {
			if (error) {
				res.json(error).status(500).end();
			}
			res.json(results).end();
		});
});

app.post('/mostActiveDay', (req, res) => {
	const {from, to} = req.body;
	pool.query(`select DATE_FORMAT(FROM_UNIXTIME(played_at), '%d.%m.%Y') date, count(*) count
                from playback
                         join user u on playback.userid = u.id
                where sid = ?
                  and played_at >= ?
                  and played_at <= ?
                GROUP BY date
                order by count DESC;`, [req.userId, from, to],
		(error, results) => {
			if (error) {
				res.json(error).status(500).end();
			}
			res.json(results).end();
		});
});

app.post('/contextPlayedCount', (req, res) => {
	const {contextUri} = req.body;
	pool.query(`select contexturi, count(*) count
                from playback
                         join user u on playback.userid = u.id
                where sid = ?
                  AND contexturi = ?
                GROUP BY contexturi
                order by count DESC;`, [req.userId, contextUri],
		(error, results) => {
			if (error) {
				res.json(error).status(500).end();
			}
			res.json(results).end();
		});
});

app.post('/trackPlayedCount', (req, res) => {
	const {trackId} = req.body;
	pool.query(`select trackid, count(*) count
                from playback
                         join user u on playback.userid = u.id
                where sid = ?
                  AND trackid = ?
                GROUP BY trackid
                order by count DESC;`, [req.userId, trackId],
		(error, results) => {
			if (error) {
				res.json(error).status(500).end();
			}
			res.json(results).end();
		});
});

app.get('/version', (req, res) => {
	res.json({version: version}).end();
});

function onIntercept(req, res, next) {
	if (req.url === '/version') {
		next();
	} else {
		const {access_token} = req.body;

		https.get({
			headers: {'Authorization': 'Bearer ' + access_token},
			host: 'api.spotify.com',
			port: 443,
			path: '/v1/me/'
		}, value => {
			if (value.statusCode !== 200) {
				res.status(401);
				res.end()
			} else {
				let data = "";
				value.on('data', chunk => {
					data += String(chunk);
				});
				value.on('end', () => {
					try {
						req.userId = JSON.parse(String(data)).id;
					} catch (e) {
						console.log(e);
						res.json(e.message).status(500).end();
					}
					next();
				});
			}
		});
	}
}

app.listen(8096);
