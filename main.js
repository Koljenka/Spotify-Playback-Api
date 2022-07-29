const express = require('express');
const https = require("https");
const fs = require('fs');
const cors = require('cors')
const mysql = require('mysql');

const interceptor = express.Router();
const version = JSON.parse(fs.readFileSync('./package.json').toString()).version

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
    const {from, to} = req.body;
    pool.query(`SELECT trackid as trackId, count(*) as count
                FROM playback
                         JOIN user ON userid = user.id
                         JOIN track t on t.id = playback.trackid
                WHERE sid = ?
                  and played_at >= ?
                  and played_at <= ?
                GROUP BY trackid
                ORDER BY c DESC
                LIMIT 5;`, [req.userId, from, to],
        (error, results) => {
            if (error) {
                res.json(error).status(500).end();
            }
            res.json(results).end();
        });
});

app.post('/isTopTrackForDays', (req, res) => {
    const {track_id} = req.body;
    pool.query(`call top_track_for_days(?, (SELECT id from user where sid = ?));`, [track_id, req.userId],
        (error, results) => {
            if (error) {
                res.json(error).status(500).end();
            }
            res.json(results[0][0]).end();
        });
});

app.post('/isTopTrackForMonths', (req, res) => {
    const {track_id} = req.body;
    pool.query(`call top_track_for_month(?, (SELECT id from user where sid = ?));`, [track_id, req.userId],
        (error, results) => {
            if (error) {
                res.json(error).status(500).end();
            }
            // noinspection JSUnresolvedVariable
            res.json(JSON.parse(results[0][0].top_months)).end();
        });
});

app.post('/getTopTracksForEachMonth', (req, res) => {
    pool.query(`call top_tracks_each_month((SELECT id from user where sid = ?));`, [req.userId],
        (error, results) => {
            if (error) {
                res.json(error).status(500).end();
            }
            // noinspection JSUnresolvedVariable
            res.json(JSON.parse(results[0][0].top_months)).end();
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
    pool.query(`select TIME_FORMAT(FROM_UNIXTIME(played_at), '%H')  hour,
                       (count(*) / (SELECT COUNT(*)
                                    FROM playback
                                             join user u on playback.userid = u.id
                                    where sid = ?
                                      and played_at >= ?
                                      and played_at <= ?) * 100) as count
                from playback
                         join user u on playback.userid = u.id
                where sid = ?
                  and played_at >= ?
                  and played_at <= ?
                GROUP BY hour
                order by hour; `, [req.userId, from, to, req.userId, from, to],
        (error, results) => {
            if (error) {
                res.json(error).status(500).end();
            }
            res.json(results).end();
        });
});

app.post('/streak', (req, res) => {
    const {from, to} = req.body;
    pool.query(`SELECT FROM_DAYS(MIN(D.day)) AS start, FROM_DAYS(MAX(D.day)) AS end, (MAX(D.day) - MIN(D.day)) as days
                FROM (SELECT days.day, days.day - (@row_number := @row_number + 1) AS grp
                      FROM (
                               SELECT (TO_DAYS(DATE(FROM_UNIXTIME(played_at)))) day
                               FROM playback
                                        JOIN user u on playback.userid = u.id
                                        CROSS JOIN (SELECT @row_number := 0) AS x
                               WHERE sid = ?
                                 and played_at >= ?
                                 and played_at <= ?
                               group by day
                           ) as days) AS D
                GROUP BY grp
                ORDER BY days DESC
                LIMIT 5;`, [req.userId, from, to],
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

app.post('/totalTracks', (req, res) => {
    const {from, to} = req.body;
    pool.query(`select count(*) count
                from playback
                         join user u on playback.userid = u.id
                where sid = ?
                  and played_at >= ?
                  and played_at <= ?
                order by count DESC;`, [req.userId, from, to],
        (error, results) => {
            if (error) {
                res.json(error).status(500).end();
            }
            res.json(results).end();
        });
});

app.post('/uniqueTracks', (req, res) => {
    const {from, to} = req.body;
    pool.query(`select count(DISTINCT (trackid)) count
                from playback
                         join user u on playback.userid = u.id
                where sid = ?
                  and played_at >= ?
                  and played_at <= ?
                order by count DESC;`, [req.userId, from, to],
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
