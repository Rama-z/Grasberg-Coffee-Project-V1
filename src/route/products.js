// Import Router
const express = require("express");
const isLogin = require("../middleware/isLogin");
const allowedRole = require("../middleware/allowedRole");
const imageUpload = require("../middleware/upload");
const app = express();
const { uploaderProfile } = require("../middleware/cloudinaryProduct");
const cloud = require("../middleware/cloudinary");
const { memoryStorageUploadProfile } = require("../middleware/multerUpload");
// const skipImage = require("../middleware/skipImage");

// let skipImage = (req, res, next) => {
//   if (req.body) {
//     return next("route");
//   }
//   return next();
// };

//Import Controller
const {
  getProduct,
  getProductById,
  create,
  editProduct,
  drop,
} = require("../controller/products");
// buat router
const productsRouter = express.Router();

// Menjalankan query
// http://localhost:8080/api/v1/products
// Tidak perlu menuliskan kembali di get karena ini subrouter

productsRouter.get("/", getProduct);
productsRouter.get("/:id", getProductById);
productsRouter.post(
  "/",
  isLogin(),
  allowedRole("admin"),
  memoryStorageUploadProfile,
  cloud.uploader,
  create
);

// agar dinamis menggunakan :id

productsRouter.patch(
  "/delete/:id",
  isLogin(),
  allowedRole("admin"),
  editProduct
);

productsRouter.patch(
  "/:id",
  isLogin(),
  allowedRole("admin"),
  memoryStorageUploadProfile,
  cloud.uploader,
  editProduct
);

// Export routernya
module.exports = productsRouter;
