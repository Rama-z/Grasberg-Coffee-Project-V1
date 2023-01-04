const repoTransaction = require("../repo/transactions");
const sendResponse = require("../helper/response");
const midTransClient = require("midtrans-client");

let coreApi = new midTransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.SERVER_KEY_MIDTRANS,
  clientKey: process.env.CLIENT_KEY_MIDTRANS,
});

const paymentWithMidTrans = async (total_price, payment_id, bank) => {
  const parameter = {
    payment_type: "bank_transfer",
    transaction_details: {
      gross_amount: parseInt(total_price),
      order_id: payment_id,
    },
    bank_transfer: {
      bank: bank,
    },
  };
  return await coreApi.charge(parameter);
};

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
        req.userPayload.user_id
      );
      const transaction_id = response.data.id;
      const responseItem = await repoTransaction.createItem(
        req.body.product_item,
        transaction_id
      );
      let transaction_item = [];
      responseItem.map((product) => {
        console.log(product);
        const promo_id = product.promo_id || 999;
        const temp = {
          transaction_id: transaction_id,
          product_id: product.product_id,
          size_id: product.size_id,
          quantity: product.quantity,
          promo_id: promo_id,
          subtotal: product.subtotal,
        };
        transaction_item.push(temp);
      });
      const results = {
        id: transaction_id,
        user_id: req.userPayload.user_id,
        transaction_item,
        total_price: req.body.total_price,
        delivery_address: req.body.delivery_address,
        phone: req.body.phone,
        promo_id: req.body.promo_id || 999,
        payment_method: req.body.payment_method,
        order_status: response.status,
      };
      console.log("bank", req.body.payment_method);
      const midTrans = await paymentWithMidTrans(
        req.body.total_price,
        response.data.payment_id,
        req.body.payment_method
      );

      const result = {
        data: {
          results,
          midTrans,
        },
      };
      return sendResponse.success(res, response.status || 200, result);
    } catch (err) {
      console.log(err);
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  midTransHandler: async (req, res) => {
    try {
      const response = await repoTransaction.midTransHandler(req.body);
      sendResponse.success(res, response.status || 200, response);
    } catch (err) {
      sendResponse.error(res, err.status || 500, err);
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
      console.log("delete");
      const response = await repoTransaction.drop(req.params.id);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      console.log(err);
      console.log("err");
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  getHistory: async (req, res) => {
    try {
      const api = `${req.protocol}://${req.get("HOST")}`;
      const response = await repoTransaction.getHistory(
        req.query,
        req.userPayload.user_id,
        api
      );
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
};
