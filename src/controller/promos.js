// import repo

const repoPromos = require("../repo/promos");
const sendResponse = require("../helper/response.js");
const search = async (req, res) => {
  try {
    const response = await repoPromos.search(req.query);
    return sendResponse.success(res, response.status, response);
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

const create = async (req, res) => {
  try {
    const response = await repoPromos.create(req.body, req.file);
    return sendResponse.success(res, response.status, response);
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

const edit = async (req, res) => {
  try {
    const response = await repoPromos.edit(req.body, req.params, req.file);
    return sendResponse.success(res, response.status, response);
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

const drop = async (req, res) => {
  try {
    const response = await repoPromos.drop(req.params.id);
    return sendResponse.success(res, response.status, response);
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

module.exports = {
  search,
  create,
  edit,
  drop,
};
