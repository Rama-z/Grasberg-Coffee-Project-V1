// import repo

const repoTransaction = require("../repo/transactionsRepo");

const search = async (req, res) => {
  try {
    console.log(req.query);
    const response = await repoTransaction.searchTrans(req.query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const filter = async (req, res) => {
  try {
    console.log(req.query);
    const response = await repoTransaction.filterTrans(req.query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const sort = async (req, res) => {
  try {
    console.log(req.query);
    const response = await repoTransaction.sortTrans(req.query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const create = async (req, res) => {
  try {
    const response = await repoTransaction.createTrans(req.body);
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
    const response = await repoTransaction.editTrans(req.body, req.params);
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
  filter,
  sort,
  create,
  edit,
};
