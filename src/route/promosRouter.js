// Import Router
const express = require("express");

const { search, create, edit } = require("../controller/promosController");

// buat router
const promosRouter = express.Router();

promosRouter.get("/", search);
promosRouter.post("/createPromos/", create);
promosRouter.patch("/:id", edit);

// Export routernya
module.exports = promosRouter;
