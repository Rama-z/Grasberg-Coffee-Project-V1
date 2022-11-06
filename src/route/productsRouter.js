// Import Router
const express = require("express");
const isLogin = require("../middleware/isLogin");
const allowedRole = require("../middleware/allowedRole");
const imageUpload = require("../middleware/upload");
const app = express();
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
  paginasi,
  createWithImage,
  editProduct,
  drop,
} = require("../controller/productsController");
// buat router
const productsRouter = express.Router();

// Menjalankan query
// http://localhost:8080/api/v1/products
// Tidak perlu menuliskan kembali di get karena ini subrouter
productsRouter.get("/:id", getProductsbyId);
productsRouter.get("/", paginasi);

// http://localhost:8080/api/v1/products

productsRouter.post(
  "/",
  isLogin(),
  allowedRole("admin"),
  imageUpload.single("image"),
  createWithImage
);
// agar dinamis menggunakan :id

productsRouter.patch(
  "/image/:id",
  isLogin(),
  imageUpload.single("image"),
  editProduct
);

productsRouter.delete("/:id", isLogin(), allowedRole("admin"), drop);

// Export routernya
module.exports = productsRouter;
