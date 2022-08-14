/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get the percentage of listened tracks for each hour
*
* accessToken String 
* from Integer Unix timestamp in seconds
* to Integer Unix timestamp in seconds
* returns List
* */
const getListeningClock = ({ accessToken, from, to }) => new Promise(
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
* Gets the most active day
*
* accessToken String 
* from Integer Unix timestamp in seconds
* to Integer Unix timestamp in seconds
* returns List
* */
const getMostActiveDay = ({ accessToken, from, to }) => new Promise(
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
* Gets the top five streaks of continuous days of listening
*
* accessToken String 
* from Integer Unix timestamp in seconds
* to Integer Unix timestamp in seconds
* returns List
* */
const getStreak = ({ accessToken, from, to }) => new Promise(
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
* Gets the top 5 artists for the given timeframe
*
* accessToken String 
* from Integer Unix timestamp in seconds
* to Integer Unix timestamp in seconds
* returns List
* */
const getTopArtists = ({ accessToken, from, to }) => new Promise(
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
* Gets the top 5 contexts for the given timeframe
*
* accessToken String 
* from Integer Unix timestamp in seconds
* to Integer Unix timestamp in seconds
* returns List
* */
const getTopContexts = ({ accessToken, from, to }) => new Promise(
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
* Gets the top 5 tracks for the given timeframe
*
* accessToken String 
* from Integer Unix timestamp in seconds
* to Integer Unix timestamp in seconds
* returns List
* */
const getTopTracks = ({ accessToken, from, to }) => new Promise(
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
  getListeningClock,
  getMostActiveDay,
  getStreak,
  getTopArtists,
  getTopContexts,
  getTopTracks,
};
