// Import Router
const express = require("express");
const isLogin = require("../middleware/isLogin");
const imageUpload = require("../middleware/upload");
const allowedRole = require("../middleware/allowedRole");
const { memoryStorageUploadProfile } = require("../middleware/multerUpload");
const cloud = require("../middleware/cloudinary");

// import controller
const {
  sort,
  create,
  edit,
  history,
  getHistory,
  drop,
  midTransHandler,
} = require("../controller/transactions");

// buat router
const transactionsRouter = express.Router();

transactionsRouter.get(
  "/",
  isLogin(),
  allowedRole("user", "admin"),
  getHistory
);
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
  memoryStorageUploadProfile,
  cloud.uploaderTrans,
  create
);

transactionsRouter.patch("/midTransHandler", midTransHandler);

transactionsRouter.patch(
  "/edit/:id",
  isLogin(),
  allowedRole("admin"),
  memoryStorageUploadProfile,
  cloud.uploaderTrans,
  edit
);

transactionsRouter.patch(
  "/delete/:id",
  isLogin(),
  allowedRole("user", "admin"),
  edit
);

// Export routernya
module.exports = transactionsRouter;
