// import repo

const repoPromos = require("../repo/promosRepo");

const search = async (req, res) => {
  try {
    console.log(req.query);
    const response = await repoPromos.searchPromos(req.query);
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
    const response = await repoPromos.createPromos(req.body);
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
    const response = await repoPromos.editPromos(req.body, req.params);
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
  search,
  create,
  edit,
};
