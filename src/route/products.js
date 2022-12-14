// Import Router
const express = require("express");
const isLogin = require("../middleware/isLogin");
const allowedRole = require("../middleware/allowedRole");
const imageUpload = require("../middleware/upload");
const app = express();
const cloud = require("../middleware/cloudinary");
const { uploaderProfile } = require("../middleware/cloudinaryProduct");
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
  getProductsbyId,
  getAllProduct,
  create,
  editProduct,
  drop,
} = require("../controller/products");
// buat router
const productsRouter = express.Router();

// Menjalankan query
// http://localhost:8080/api/v1/products
// Tidak perlu menuliskan kembali di get karena ini subrouter
productsRouter.get("/", getAllProduct);
productsRouter.get("/:id", isLogin(), getProductsbyId);
// http://localhost:8080/api/v1/products

productsRouter.post(
  "/",
  isLogin(),
  allowedRole("admin"),
  memoryStorageUploadProfile,
  cloud.uploader,
  create
);

// agar dinamis menggunakan :id

productsRouter.patch("/image/:id", imageUpload.single("image"), editProduct);

productsRouter.delete("/:id", isLogin(), allowedRole("admin"), drop);

// Export routernya
module.exports = productsRouter;
