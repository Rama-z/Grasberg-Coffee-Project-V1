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
productsRouter.get("/:id", getProductsbyId);
// http://localhost:8080/api/v1/products

productsRouter.post(
  "/",
  isLogin(),
  allowedRole("admin"),
  imageUpload.single("image"),
  create
);

// agar dinamis menggunakan :id

productsRouter.patch("/image/:id", imageUpload.single("image"), editProduct);

productsRouter.delete("/:id", isLogin(), allowedRole("admin"), drop);

// Export routernya
module.exports = productsRouter;
