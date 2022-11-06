// inmport repository
const repoProducts = require("../repo/productsRepo");
const sendResponse = require("../helper/response.js");

const getProductsbyId = async (req, res) => {
  try {
    const response = await repoProducts.getProductById(req.params.id);
    res.status(200).json({ result: response.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "internal server error",
    });
  }
};

const paginasi = async (req, res) => {
  try {
    const responsea = await repoProducts.paginasi2(req.query);
    const response = await repoProducts.paginasi(req.query);
    let totalPage = Number(responsea.rows[0].count);
    let totalPages = "";
    console.log(req.query.limit);
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
    res.status(200).json({
      meta: {
        count: Number(responsea.rows[0].count),
        next: nextLink,
        prev: prevLink,
        totalPages: totalPages,
      },
      result: response.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "internal server error",
    });
  }
};

const createWithImage = async (req, res) => {
  try {
    const response = await repoProducts.create(req.body, req.file);
    res.status(200).json({
      qqq: req.file,
      msg: "Input Sukses Sila Check di List Products, dan Update Id Products",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Masukkan Data Dengan Tepat",
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const response = await repoProducts.editProduct(
      req.body,
      req.params,
      req.file
    );
    res.status(200).json({
      asd: req.file,
      msg: "Data berhasil diedit, sila check list Products",
      Menu: response.rows[0].menu,
      Price: response.rows[0].price,
      Varian_id: response.rows[0].varian_id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Errorr",
    });
  }
};

const drop = async (req, res) => {
  try {
    await repoProducts.drop(req.params.id);
    sendResponse.success(res, 200, {
      msg: "Delete Profile Success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      asd: err,
      msg: "Internal Server Errorr",
    });
  }
};

module.exports = {
  getProductsbyId,
  paginasi,
  createWithImage,
  editProduct,
  drop,
};
