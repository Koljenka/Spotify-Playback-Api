/* eslint-disable no-unused-vars */
const Service = require('./Service');
const {getUser, getPool} = require("../utils/apiUtils");
const logger = require("../logger");

/**
 * Gets the play count for the given context
 *
 * accessToken String
 * contextUri String
 * returns CountObject
 * */
const getContextPlayCount = ({accessToken, contextUri}) => new Promise(
    async (resolve, reject) => {
        return getUser(accessToken).then(userId => {
            getPool().query(`select count(*) count
                             from playback
                                      join user u on playback.userid = u.id
                             where sid = ?
                               AND contexturi = ?
                             GROUP BY contexturi
                             order by count DESC
                             LIMIT 1;`, [userId, contextUri],
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
    }
);

module.exports = {
    getContextPlayCount,
};