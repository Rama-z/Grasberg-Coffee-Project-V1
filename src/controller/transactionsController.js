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

const users = async (req, res) => {
  try {
    const responsea = await repoTransaction.users2(req.query);
    const response = await repoTransaction.users(req.query);
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
  filter,
  sort,
  create,
  edit,
  users,
};
