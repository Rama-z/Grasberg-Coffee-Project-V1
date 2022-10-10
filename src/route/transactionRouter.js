// Import Router
const express = require("express");

// import controller
const {
  search,
  filter,
  sort,
  create,
  edit,
} = require("../controller/transactionsController");

// buat router
const transactionsRouter = express.Router();

transactionsRouter.get("/", search);
transactionsRouter.get("/filter/", filter);
transactionsRouter.get("/sort/", sort);
transactionsRouter.post("/createTransaction/", create);
transactionsRouter.patch("/:id", edit);

// Export routernya
module.exports = transactionsRouter;
