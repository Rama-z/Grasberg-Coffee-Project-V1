// import repo

const repoPromos = require("../repo/promosRepo");
const sendResponse = require("../helper/response.js");
const search = async (req, res) => {
  try {
    console.log(req.query);
    const response = await repoPromos.search(req.query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const create = async (req, res) => {
  try {
    const response = await repoPromos.create(req.body, req.params, req.file);
    res.status(200).json({
      asd: req.params,
      qqq: req.file.filename,
      msg: "Input Sukses Sila Check di List Promos, dan Update Id Promos",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Masukkan Data Dengan Tepat",
    });
  }
};

const edit = async (req, res) => {
  try {
    const response = await repoPromos.edit(req.body, req.params, req.file);
    res.status(200).json({
      asd: req.file,
      msg: "Data berhasil diedit, sila check list Products",
      // Menu: response.rows[0].menu,
      // Price: response.rows[0].price,
      // Varian_id: response.rows[0].varian_id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const drop = async (req, res) => {
  try {
    await repoPromos.drop(req.params.id);
    sendResponse.success(res, 200, {
      msg: "Delete Promos Success",
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
  search,
  create,
  edit,
  drop,
};
