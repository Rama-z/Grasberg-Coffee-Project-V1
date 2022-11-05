// Import Router
const express = require("express");
const isLogin = require("../middleware/isLogin");
const allowedRole = require("../middleware/allowedRole");

// import controller
const {
  getUser,
  createUser,
  editUser,
  deleteUser,
  register,
  editPassword,
} = require("../controller/userController");
const { profile } = require("../repo/userRepo");

// buat router
const usersRouter = express.Router();

usersRouter.get("/searchUser/", getUser);

usersRouter.post("/createUser/", createUser);

usersRouter.patch("/:id", editUser);

usersRouter.delete("/:id", deleteUser);

// register
usersRouter.post("/register/", register);

// edit pw
usersRouter.patch("/", isLogin(), allowedRole("user"), editPassword);

// edit profil
usersRouter.patch(
  "/profile/",
  isLogin(),
  allowedRole("user", "admin"),
  profile
);

// Export routernya
module.exports = usersRouter;
