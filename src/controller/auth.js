const authRepo = require("../repo/auth");
const sendResponse = require("../helper/response");

module.exports = {
  login: (req, res) => {
    authRepo
      .login(req.body)
      .then((response) => {
        sendResponse.success(res, 200, {
          data: response,
          msg: "Login Success",
        });
      })
      .catch((ObjErr) => {
        const statusCode = ObjErr.statusCode || 500;
        return res.status(statusCode).json({ msg: ObjErr.err.message });
      });
  },
  register: async (req, res) => {
    try {
      const { body } = req;
      const response = await authRepo.register(body);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status, err);
    }
  },
  logout: async (req, res) => {
    try {
      const response = await authRepo.logout(req.userPayload);
      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ msg: "internal Server Errorr" });
    }
  },
};
