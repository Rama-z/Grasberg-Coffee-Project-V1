// import repo

const repoPromos = require("../repo/promosRepo");

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
    const response = await repoPromos.create(req.body);
    res.status(200).json({
      msg: "Data Berhasil dibuat, silakan check di List Promo dan update ID",
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
    const response = await repoPromos.edit(req.body, req.params);
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  search,
  create,
  edit,
};
