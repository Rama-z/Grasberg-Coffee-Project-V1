const authRouter = require("express").Router();
const authController = require("../controller/auth");
const isLogin = require("../middleware/isLogin");
// login
authRouter.post("/", authController.login);

authRouter.delete("/logout", isLogin(), authController.logout);

// authRouter.post("/logout/", verifyToken, (req, res) => {
//   const { userId, token } = request;
//   redisClient.get(userId, (error, data) => {
//     if (error) {
//       response.send({ error });
//     }
// });

module.exports = authRouter;
