// Import Router
const express = require("express");
const isLogin = require("../middleware/isLogin");
const allowedRole = require("../middleware/allowedRole");
const imageUpload = require("../middleware/upload");
const usersController = require("../controller/users");

// Buat router
const usersRouter = express.Router();

// Get all user by admin
usersRouter.get(
  "/searchUser/",
  isLogin(),
  allowedRole("admin"),
  usersController.getUser
);

// Get user profile
usersRouter.get(
  "/users",
  isLogin(),
  allowedRole("user", "admin"),
  usersController.getUserById
);

// Edit pw (make it forgot password also)
usersRouter.patch(
  "/editpwd",
  isLogin(),
  allowedRole("user", "admin"),
  usersController.editPassword
);

// Register account
usersRouter.post("/register/", usersController.register);

// Edit profile
usersRouter.patch(
  "/editProfile",
  isLogin(),
  allowedRole("user", "admin"),
  imageUpload.single("image"),
  usersController.update
);

// Delete user
usersRouter.delete(
  "/:id",
  isLogin(),
  allowedRole("admin"),
  usersController.deleteUser
);

// Export router
module.exports = usersRouter;
