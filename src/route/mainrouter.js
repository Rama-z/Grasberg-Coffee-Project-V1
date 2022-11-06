// Import Router
const express = require("express");

// buat router
const mainRouter = express.Router();

const prefix = "/api/v1";

// Import subrouter
const productsRouter = require("./productsRouter");
const promosRouter = require("./promosRouter");
const transactionsRouter = require("./transactionRouter");
const usersRouter = require("./usersRouter");
const authRouter = require("./auth");

// import middleware
const imageUpload = require("../middleware/upload");

// Sambungkan subrouter dengan mainrouter
mainRouter.use(`${prefix}/products`, productsRouter);
mainRouter.use(`${prefix}/promos`, promosRouter);
mainRouter.use(`${prefix}/transactions`, transactionsRouter);
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/auth`, authRouter);

// Pemasangan route
// http://localhost:8080/
mainRouter.get("/", (req, res) => {
  res.json({
    msg: "welcome in Grasberg Coffee",
  });
});

// image uplaod
mainRouter.post("/", imageUpload.single("image"), (req, res) => {
  res.json({ file: req.file });
});

// Export routernya
module.exports = mainRouter;
