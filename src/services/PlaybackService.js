/* eslint-disable no-unused-vars */
const Service = require('./Service');
const {getUser, getPool} = require("../utils/apiUtils");

/**
 * Gets the playback history
 *
 * accessToken String
 * returns List
 * */
const getPlaybackHistory = ({accessToken}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query('SELECT DISTINCT trackid as trackId, contexturi as contextUri, played_at as playedAt FROM playback JOIN user ON userid = user.id WHERE sid = ? ORDER BY played_at DESC', [userId],
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
    getPlaybackHistory,
};
