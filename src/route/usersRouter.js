// Import Router
const express = require("express");

// import controller
const {
  getUser,
  createUser,
  editUser,
  deleteUser,
  register,
  editPassword,
} = require("../controller/userController");

// buat router
const usersRouter = express.Router();

usersRouter.get("/searchUser/", getUser);

usersRouter.post("/createUser/", createUser);

usersRouter.patch("/:id", editUser);

usersRouter.delete("/:id", deleteUser);

// register
usersRouter.post("/register/", register);

// edit pw
usersRouter.patch("/", editPassword);

// edit profil
usersRouter.patch("/profile/", (req, res) => {});

// Export routernya
module.exports = usersRouter;
