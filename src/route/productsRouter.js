// Import Router
const express = require("express");

//Import Controller
const {
  get,
  search,
  sortProducts,
  create,
  edit,
} = require("../controller/productsController");
// buat router
const productsRouter = express.Router();

// Menjalankan query
// http://localhost:8080/api/v1/products
// Tidak perlu menuliskan kembali di get karena ini subrouter
productsRouter.get("/", get);

// http://localhost:8080/api/v1/products/search/
// Membuat fitur search dengan pengurutan harga
productsRouter.get("/search/", search);

// http://localhost:8080/api/v1/products/coffeevarian/
productsRouter.get("/sortProducts/", sortProducts);

// http://localhost:8080/api/v1/products
productsRouter.post("/createProducts/", create);

// agar dinamis menggunakan :id
productsRouter.patch("/:id", edit);

// Export routernya
module.exports = productsRouter;
