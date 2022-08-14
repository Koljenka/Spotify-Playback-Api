/**
 * The TrackController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/TrackService');
const getMonthsWhereTrackIsTop = async (request, response) => {
  await Controller.handleRequest(request, response, service.getMonthsWhereTrackIsTop);
};

const getTopTrackForDays = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTopTrackForDays);
};

const getTopTrackForEachMonth = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTopTrackForEachMonth);
};

const getTotalTracks = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTotalTracks);
};

const getTrackPlayCount = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTrackPlayCount);
};

const getUniqueTracks = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUniqueTracks);
};


module.exports = {
  getMonthsWhereTrackIsTop,
  getTopTrackForDays,
  getTopTrackForEachMonth,
  getTotalTracks,
  getTrackPlayCount,
  getUniqueTracks,
};
