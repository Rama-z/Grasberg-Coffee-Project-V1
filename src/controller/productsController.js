// inmport repository
const repoProducts = require("../repo/productsRepo");

const get = async (req, res) => {
  try {
    const response = await repoProducts.getProducts();
    res.status(200).json({
      result: response.rows,
    });
  } catch (err) {
    res.status(500).json({
      msg: "internal server error",
    });
  }
};

const search = async (req, res) => {
  try {
    console.log(req.query);
    const response = await repoProducts.getDynamic(req.query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const sortProducts = async (req, res) => {
  try {
    const response = await repoProducts.sortProducts(req.query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "internal server error",
    });
  }
};

const create = async (req, res) => {
  try {
    const response = await repoProducts.createProduct(req.body);
    res.status(200).json({
      result: response.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "internal Error",
    });
  }
};

const edit = async (req, res) => {
  try {
    const response = await repoProducts.editProduct(req.body, req.params);
    res.status(200).json({
      result: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  get,
  search,
  sortProducts,
  create,
  edit,
};
