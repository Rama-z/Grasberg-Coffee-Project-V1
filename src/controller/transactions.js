const repoTransaction = require("../repo/transactions");
const sendResponse = require("../helper/response");

const midtransClient = require("midtrans-client");

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY_MIDTRANS,
  clientKey: process.env.CLIENT_KEY_MIDTRANS,
});

module.exports = {
  sort: async (req, res) => {
    try {
      const responsea = await repoTransaction.paginasi2(req.query);
      const response = await repoTransaction.paginasi(req.query);
      let totalPage = Number(responsea.rows[0].count);
      let totalPages = Math.ceil(totalPage / req.query.limit);
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
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  history: async (req, res) => {
    try {
      const response = await repoTransaction.history(
        req.query,
        req.userPayload.user_id
      );
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  create: async (req, res) => {
    try {
      const response = await repoTransaction.create(
        req.body,
        req.userPayload.user_id,
        req.file
      );
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  edit: async (req, res) => {
    try {
      const response = await repoTransaction.editTrans(
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
      const response = await repoTransaction.drop(req.params.id);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
};
