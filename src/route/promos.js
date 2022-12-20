// Import Router
const express = require("express");
const isLogin = require("../middleware/isLogin");
const allowedRole = require("../middleware/allowedRole");
const imageUpload = require("../middleware/upload");
const { search, create, edit, drop } = require("../controller/promos");
const cloud = require("../middleware/cloudinary");
const { memoryStorageUploadProfile } = require("../middleware/multerUpload");

// buat router
const promosRouter = express.Router();

promosRouter.get("/", search);
promosRouter.post(
  "/",
  isLogin(),
  allowedRole("admin"),
  memoryStorageUploadProfile,
  cloud.uploaderPromo,
  create
);

promosRouter.patch(
  "/:id",
  isLogin(),
  allowedRole("admin"),
  imageUpload.single("image"),
  edit
);
promosRouter.delete("/:id", isLogin(), allowedRole("admin"), drop);
// Export routernya
module.exports = promosRouter;
