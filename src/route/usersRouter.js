// Import Router
const express = require("express");

// import controller
const {
  getUser,
  createUser,
  editUser,
  deleteUser,
} = require("../controller/userController");

// buat router
const usersRouter = express.Router();

usersRouter.get("/searchUser/", getUser);

usersRouter.post("/createUser/", createUser);

usersRouter.patch("/:id", editUser);

usersRouter.delete("/:id", deleteUser);
// Export routernya
module.exports = usersRouter;
