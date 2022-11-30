// Import Router
const express = require("express");
const isLogin = require("../middleware/isLogin");
const imageUpload = require("../middleware/upload");
const allowedRole = require("../middleware/allowedRole");
// import controller
const {
  sort,
  create,
  edit,
  history,
  drop,
} = require("../controller/transactions");

// buat router
const transactionsRouter = express.Router();

transactionsRouter.get("/sort/", isLogin(), allowedRole("admin"), sort);
transactionsRouter.get(
  "/history/",
  isLogin(),
  allowedRole("admin", "user"),
  history
);

transactionsRouter.post(
  "/createTransaction/",
  isLogin(),
  allowedRole("user", "admin"),
  imageUpload.single("image"),
  create
);

transactionsRouter.patch(
  "/:id",
  isLogin(),
  allowedRole("admin"),
  imageUpload.single("image"),
  edit
);

transactionsRouter.delete("/:id", isLogin(), allowedRole("admin"), drop);

// Export routernya
module.exports = transactionsRouter;
