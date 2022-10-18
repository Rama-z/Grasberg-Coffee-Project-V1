// Import Router
const express = require("express");
const isLogin = require("../middleware/isLogin");
const imageUpload = require("../middleware/upload");
// import controller
const {
  search,
  filter,
  sort,
  create,
  edit,
  users,
} = require("../controller/transactionsController");

// buat router
const transactionsRouter = express.Router();

transactionsRouter.get("/", search);
transactionsRouter.get("/filter/", filter);
transactionsRouter.get("/sort/", sort);
transactionsRouter.get("/users/", isLogin(), users);
transactionsRouter.post("/createTransaction/", create);
transactionsRouter.patch("/:id", edit);

// Export routernya
module.exports = transactionsRouter;
