/**
 * The StatisticsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/StatisticsService');
const getListeningClock = async (request, response) => {
  await Controller.handleRequest(request, response, service.getListeningClock);
};

const getMostActiveDay = async (request, response) => {
  await Controller.handleRequest(request, response, service.getMostActiveDay);
};

const getStreak = async (request, response) => {
  await Controller.handleRequest(request, response, service.getStreak);
};

const getTopArtists = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTopArtists);
};

const getTopContexts = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTopContexts);
};

const getTopTracks = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTopTracks);
};


module.exports = {
  getListeningClock,
  getMostActiveDay,
  getStreak,
  getTopArtists,
  getTopContexts,
  getTopTracks,
};
