/* eslint-disable no-unused-vars */
const Service = require('./Service');
const {getUser, getPool} = require("../utils/apiUtils");

/**
 * Get the percentage of listened tracks for each hour
 *
 * accessToken String
 * from Integer Unix timestamp in seconds
 * to Integer Unix timestamp in seconds
 * returns List
 * */
const getListeningClock = ({accessToken, from, to}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`select TIME_FORMAT(FROM_UNIXTIME(played_at), '%H')  hour,
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
                order by hour; `, [userId, from, to, userId, from, to],
                (error, results) => {
                    if (error) {
                        return reject(Service.rejectResponse({title: 'Database Error', message: error.message}))
                    }
                    return resolve(Service.successResponse(results))
                });
        }).catch(errorResponse => reject(errorResponse))
    },
);
/**
 * Gets the most active day
 *
 * accessToken String
 * from Integer Unix timestamp in seconds
 * to Integer Unix timestamp in seconds
 * returns List
 * */
const getMostActiveDay = ({accessToken, from, to}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`select DATE_FORMAT(FROM_UNIXTIME(played_at), '%d.%m.%Y') date, count(*) count
                from playback
                         join user u on playback.userid = u.id
                where sid = ?
                  and played_at >= ?
                  and played_at <= ?
                GROUP BY date
                order by count DESC LIMIT 1;`, [userId, from, to],
                (error, results) => {
                    if (error) {
                        return reject(Service.rejectResponse({title: 'Database Error', message: error.message}))
                    }
                    return resolve(Service.successResponse(results[0]))
                });
        }).catch(errorResponse => reject(errorResponse))
    },
);
/**
 * Gets the top five streaks of continuous days of listening
 *
 * accessToken String
 * from Integer Unix timestamp in seconds
 * to Integer Unix timestamp in seconds
 * returns List
 * */
const getStreak = ({accessToken, from, to}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`SELECT FROM_DAYS(MIN(D.day)) AS start, FROM_DAYS(MAX(D.day)) AS end, (MAX(D.day) - MIN(D.day)) as days
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
                LIMIT 1;`, [userId, from, to],
                (error, results) => {
                    if (error) {
                        return reject(Service.rejectResponse({title: 'Database Error', message: error.message}))
                    }
                    return resolve(Service.successResponse(results[0]))
                });
        }).catch(errorResponse => reject(errorResponse))
    },
);
/**
 * Gets the top 5 artists for the given timeframe
 *
 * accessToken String
 * from Integer Unix timestamp in seconds
 * to Integer Unix timestamp in seconds
 * returns List
 * */
const getTopArtists = ({accessToken, from, to}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`SELECT artistid as id, count(*) as count
                             FROM playback
                                      JOIN user ON userid = user.id
                                      JOIN track_artist ta on playback.trackid = ta.trackid
                             WHERE sid = ?
                               and played_at >= ?
                               and played_at <= ?
                             GROUP BY artistid
                             ORDER BY count DESC
                             LIMIT 5;`, [userId, from, to],
                (error, results) => {
                    if (error) {
                        return reject(Service.rejectResponse({title: 'Database Error', message: error.message}))
                    }
                    return resolve(Service.successResponse(results))
                });
        }).catch(errorResponse => reject(errorResponse))
    },
);
/**
 * Gets the top 5 contexts for the given timeframe
 *
 * accessToken String
 * from Integer Unix timestamp in seconds
 * to Integer Unix timestamp in seconds
 * returns List
 * */
const getTopContexts = ({accessToken, from, to}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`SELECT contexturi as id, count(*) as count
                             FROM playback
                                      JOIN user ON userid = user.id
                             WHERE sid = ?
                               and played_at >= ?
                               and played_at <= ?
                               and contexturi is not null
                             GROUP BY contexturi
                             ORDER BY count DESC
                             LIMIT 5;`, [userId, from, to],
                (error, results) => {
                    if (error) {
                        return reject(Service.rejectResponse({title: 'Database Error', message: error.message}))
                    }
                    return resolve(Service.successResponse(results))
                });
        }).catch(errorResponse => reject(errorResponse))
    },
);
/**
 * Gets the top 5 tracks for the given timeframe
 *
 * accessToken String
 * from Integer Unix timestamp in seconds
 * to Integer Unix timestamp in seconds
 * returns List
 * */
const getTopTracks = ({accessToken, from, to}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`SELECT trackid as id, count(*) as count
                             FROM playback
                                      JOIN user ON userid = user.id
                             WHERE sid = ?
                               and played_at >= ?
                               and played_at <= ?
                             GROUP BY trackid
                             ORDER BY count DESC
                             LIMIT 5;`, [userId, from, to],
                (error, results) => {
                    if (error) {
                        return reject(Service.rejectResponse({title: 'Database Error', message: error.message}))
                    }
                    return resolve(Service.successResponse(results))
                });
        }).catch(errorResponse => reject(errorResponse))
    },
);

module.exports = {
    getListeningClock,
    getMostActiveDay,
    getStreak,
    getTopArtists,
    getTopContexts,
    getTopTracks,
};
