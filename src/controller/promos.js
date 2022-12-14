const repoPromos = require("../repo/promos");
const sendResponse = require("../helper/response.js");

module.exports = {
  search: async (req, res) => {
    try {
      const response = await repoPromos.search(req.query);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  create: async (req, res) => {
    try {
      const response = await repoPromos.create(req.body, req.file);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  edit: async (req, res) => {
    try {
      const response = await repoPromos.edit(req.body, req.params, req.file);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  drop: async (req, res) => {
    try {
      const response = await repoPromos.drop(req.params.id);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
};
