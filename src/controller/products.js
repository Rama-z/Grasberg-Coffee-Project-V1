// inmport repository
const repoProducts = require("../repo/products");
const sendResponse = require("../helper/response.js");

const getProductsbyId = async (req, res) => {
  try {
    const response = await repoProducts.getProductById(req.params.id);
    return sendResponse.success(res, response.status, response);
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

const getAllProduct = async (req, res) => {
  try {
    const responsea = await repoProducts.getAllProduct2(req.query);
    const response = await repoProducts.getAllProduct(req.query);
    let totalPage = Number(responsea.rows[0].count);
    let totalPages = "";
    if (!req.query.limit) {
      totalPages = 1;
    } else {
      totalPages = Math.ceil(totalPage / req.query.limit);
    }
    let host = `http://${req.get("HOST")}${req.baseUrl}${req.route.path}`;
    let link = "";
    Object.keys(req.query).forEach((keys, idx) => {
      if (keys !== "page" && keys !== "limit" && idx !== keys.length - 1) {
        link += `${keys}=${req.query[keys]}&`;
      }
      if (keys === "limit") {
        link += `${keys}=${req.query[keys]}`;
      }
    });
    let nextLink =
      Number(req.query.page) === totalPages
        ? null
        : `${host}?page=${Number(req.query.page) + 1}&${link}`;
    let prevLink =
      Number(req.query.page) === 1 || Number(req.query.page) === 0
        ? null
        : `${host}?page=${Number(req.query.page) - 1}&${link}`;
    return res.status(200).json({
      meta: {
        count: Number(responsea.rows[0].count),
        next: nextLink,
        prev: prevLink,
        totalPages: totalPages,
      },
      result: response.rows,
    });
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

const create = async (req, res) => {
  try {
    const response = await repoProducts.create(req.body, req.file);
    return sendResponse.success(res, response.status, response);
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

const editProduct = async (req, res) => {
  try {
    const response = await repoProducts.editProduct(
      req.body,
      req.params,
      req.file
    );
    return sendResponse.success(res, response.status, response);
  } catch (err) {
    console.log(err);
    return sendResponse.error(res, 500, err);
  }
};

const drop = async (req, res) => {
  try {
    const response = await repoProducts.drop(req.params.id);
    return sendResponse.success(res, 200, response);
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

module.exports = {
  getProductsbyId,
  getAllProduct,
  create,
  editProduct,
  drop,
};
