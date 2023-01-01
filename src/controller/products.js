const repoProducts = require("../repo/products");
const sendResponse = require("../helper/response.js");

module.exports = {
  getProduct: async (req, res) => {
    try {
      const api = `${req.protocol}://${req.get("HOST")}`;
      const response = await repoProducts.getProduct(req.query, api);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  getProductById: async (req, res) => {
    try {
      const response = await repoProducts.getProductById(req.params.id);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  create: async (req, res) => {
    try {
      const response = await repoProducts.create(req.body, req.file);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  editProduct: async (req, res) => {
    try {
      const response = await repoProducts.editProduct(
        req.body,
        req.params,
        req.file
      );
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  drop: async (req, res) => {
    try {
      const response = await repoProducts.drop(req.params.id);
      return sendResponse.success(res, 200, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
};
