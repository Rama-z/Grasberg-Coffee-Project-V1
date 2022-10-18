// Import Router
const express = require("express");
const isLogin = require("../middleware/isLogin");
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
  searchAndFilter,
  paginasi,
  create,
  createWithImage,
  edit,
  edit2,
} = require("../controller/productsController");
// buat router
const productsRouter = express.Router();

// Menjalankan query
// http://localhost:8080/api/v1/products
// Tidak perlu menuliskan kembali di get karena ini subrouter
productsRouter.get("/searchAndFilter", searchAndFilter);
productsRouter.get("/paginasi", paginasi);

// http://localhost:8080/api/v1/products
productsRouter.post("/createProducts/", isLogin(), create);
productsRouter.post("/", imageUpload.single("image"), createWithImage);
// agar dinamis menggunakan :id
productsRouter.patch("/:id", isLogin(), edit);
productsRouter.patch("/image/:id", imageUpload.single("image"), edit2);
// Export routernya
module.exports = productsRouter;
