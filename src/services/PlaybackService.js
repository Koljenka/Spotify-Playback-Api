/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Gets the playback history
*
* accessToken String 
* returns List
* */
const getPlaybackHistory = ({ accessToken }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        accessToken,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  getPlaybackHistory,
};
