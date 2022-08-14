/* eslint-disable no-unused-vars */
const Service = require('./Service');
const {getUser, getPool} = require("../utils/apiUtils");
const logger = require("../logger");

/**
 * Gets all the months in which the track was the top track
 *
 * accessToken String
 * trackId String
 * returns List
 * */
const getMonthsWhereTrackIsTop = ({accessToken, trackId}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`call top_track_for_month(?, (SELECT id from user where sid = ?));`, [trackId, userId],
                (error, results) => {
                    if (error) {
                        return reject(Service.rejectResponse({title: 'Database Error', message: error.message}))
                    }
                    // noinspection JSUnresolvedVariable
                    return resolve(Service.successResponse(JSON.parse(results[0][0].top_months)))
                });
        }).catch(errorResponse => reject(errorResponse))
    },
);
/**
 * Gets the number of days and plays if this track is the most listened to track for the last days
 *
 * accessToken String
 * trackId String
 * returns TopTrackForDays
 * */
const getTopTrackForDays = ({accessToken, trackId}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`call top_track_for_days(?, (SELECT id from user where sid = ?));`, [trackId, userId],
                (error, results) => {
                    if (error) {
                        return reject(Service.rejectResponse({title: 'Database Error', message: error.message}))
                    }
                    return resolve(Service.successResponse(results[0][0]))
                });
        }).catch(errorResponse => reject(errorResponse))
    },
);
/**
 * Gets the top track for each month from the beginning of recording
 *
 * accessToken String
 * returns List
 * */
const getTopTrackForEachMonth = ({accessToken}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`call top_tracks_each_month((SELECT id from user where sid = ?));`, [userId],
                (error, results) => {
                    if (error) {
                        return reject(Service.rejectResponse({title: 'Database Error', message: error.message}))
                    }
                    // noinspection JSUnresolvedVariable
                    return resolve(Service.successResponse(JSON.parse(results[0][0].top_months)))
                });
        }).catch(errorResponse => reject(errorResponse))
    },
);
/**
 * Gets the total listened to tracks for the given timeframe
 *
 * accessToken String
 * from Integer Unix timestamp in seconds
 * to Integer Unix timestamp in seconds
 * returns List
 * */
const getTotalTracks = ({accessToken, from, to}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`select count(*) count
                from playback
                         join user u on playback.userid = u.id
                where sid = ?
                  and played_at >= ?
                  and played_at <= ?
                order by count DESC;`, [userId, from, to],
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
 * Gets the play count for the given track
 *
 * accessToken String
 * trackId String
 * returns CountObject
 * */
const getTrackPlayCount = ({accessToken, trackId}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`select count(*) count
                from playback
                         join user u on playback.userid = u.id
                where sid = ?
                  AND trackid = ?
                GROUP BY trackid
                order by count DESC;`, [userId, trackId],
                (error, results) => {
                    if (error) {
                        return reject(Service.rejectResponse({title: 'Database Error', message: error.message}))
                    }
                    if (results.length === 0) {
                        results = [{count: 0}]
                    }
                    return resolve(Service.successResponse(results[0]))
                });
        }).catch(errorResponse => reject(errorResponse))
    },
);
/**
 * Gets the total listened to unique tracks for the given timeframe
 *
 * accessToken String
 * from Integer Unix timestamp in seconds
 * to Integer Unix timestamp in seconds
 * returns List
 * */
const getUniqueTracks = ({accessToken, from, to}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`select count(DISTINCT (trackid)) count
                from playback
                         join user u on playback.userid = u.id
                where sid = ?
                  and played_at >= ?
                  and played_at <= ?
                order by count DESC;`, [userId, from, to],
                (error, results) => {
                    if (error) {
                        return reject(Service.rejectResponse({title: 'Database Error', message: error.message}))
                    }
                    return resolve(Service.successResponse(results[0]))
                });
        }).catch(errorResponse => reject(errorResponse))
    },
);

module.exports = {
    getMonthsWhereTrackIsTop,
    getTopTrackForDays,
    getTopTrackForEachMonth,
    getTotalTracks,
    getTrackPlayCount,
    getUniqueTracks,
};
