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
      .catch((err) => {
        sendResponse.error(res, err.status || 500, err);
      });
  },
  register: async (req, res) => {
    try {
      const { body } = req;
      const response = await authRepo.register(body);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  logout: async (req, res) => {
    try {
      const response = await authRepo.logout(req.userPayload);
      return sendResponse.success(res, response.status, response);
    } catch (error) {
      sendResponse.error(res, err.status || 500, err);
    }
  },
};
