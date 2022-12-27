const authRouter = require("express").Router();
const authController = require("../controller/auth");
const isLogin = require("../middleware/isLogin");
// login
authRouter.post("/login", authController.login);
authRouter.post("/register/", authController.register);
authRouter.patch("/edit-password");
authRouter.post("/forgot-password", authController.forgot);
authRouter.patch("/forgot-password", authController.confirm);
authRouter.delete("/logout", isLogin(), authController.logout);

module.exports = authRouter;
