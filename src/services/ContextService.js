/* eslint-disable no-unused-vars */
const Service = require('./Service');
const {getUser, getPool} = require("../utils/apiUtils");

/**
 * Gets the play count for the given context
 *
 * accessToken String
 * contextUri String
 * returns CountObject
 * */
const getContextPlayCount = ({accessToken, contextUri}) => new Promise(
    async (resolve, reject) => {
        try {
            getUser(accessToken, res => {
                if (res.code !== 200) {
                    reject(errorRes(res))
                } else {
                    getPool().query(`select contexturi, count(*) count
                                     from playback
                                              join user u on playback.userid = u.id
                                     where sid = ?
                                       AND contexturi = ?
                                     GROUP BY contexturi
                                     order by count DESC;`, [res.content, contextUri],
                        (error, results) => {
                            if (error) {
                                reject(errorRes({code: 500, content: error.message}))
                            }
                            resolve(JSON.parse(results))
                        });
                }
            })

            resolve(Service.successResponse({
                accessToken,
                contextUri,
            }));
        } catch (e) {
            reject(errorRes({code: 500, content: e.message}));
        }
    },
);

const errorRes = ({code, content}) => {
    return Service.rejectResponse(
        content || 'Server Error',
        code || 500,
    )
}

module.exports = {
    getContextPlayCount,
};
