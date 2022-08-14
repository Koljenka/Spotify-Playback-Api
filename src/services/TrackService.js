/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Gets all the months in which the track was the top track
*
* accessToken String 
* trackId String 
* returns List
* */
const getMonthsWhereTrackIsTop = ({ accessToken, trackId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        accessToken,
        trackId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Gets the number of days and plays if this track is the most listened to track for the last days
*
* accessToken String 
* trackId String 
* returns TopTrackForDays
* */
const getTopTrackForDays = ({ accessToken, trackId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        accessToken,
        trackId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Gets the top track for each month from the beginning of recording
*
* accessToken String 
* returns List
* */
const getTopTrackForEachMonth = ({ accessToken }) => new Promise(
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
/**
* Gets the total listened to tracks for the given timeframe
*
* accessToken String 
* from Integer Unix timestamp in seconds
* to Integer Unix timestamp in seconds
* returns List
* */
const getTotalTracks = ({ accessToken, from, to }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        accessToken,
        from,
        to,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Gets the play count for the given track
*
* accessToken String 
* trackId String 
* returns CountObject
* */
const getTrackPlayCount = ({ accessToken, trackId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        accessToken,
        trackId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
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
const getUniqueTracks = ({ accessToken, from, to }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        accessToken,
        from,
        to,
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
  getMonthsWhereTrackIsTop,
  getTopTrackForDays,
  getTopTrackForEachMonth,
  getTotalTracks,
  getTrackPlayCount,
  getUniqueTracks,
};
