// import repo

const repoTransaction = require("../repo/transactionsRepo");

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

const history = async (req, res) => {
  try {
    console.log(req.query);
    console.log(req.userPayload);
    const response = await repoTransaction.history(
      req.query,
      req.userPayload.user_id
    );
    // console.log(response);
    res.status(200).json({
      result: response,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Masukkan Data Dengan Tepat",
    });
  }
};

const create = async (req, res) => {
  try {
    console.log(req.userPayload);
    const response = await repoTransaction.createTrans(
      req.body,
      req.userPayload.user_id,
      req.file
    );
    res.status(200).json({
      img: req.file,
      msg: "Input Sukses Sila Check di List Products, dan Update Id Products",
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
    const response = await repoTransaction.editTrans(
      req.body,
      req.params,
      req.file
    );
    res.status(200).json({
      msg: "Data berhasil diedit, sila check list Products",
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
    await repoTransaction.drop(req.params.id);
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
  sort,
  create,
  edit,
  history,
  drop,
};
