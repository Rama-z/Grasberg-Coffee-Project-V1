const userRepo = require("../repo/users");
const sendResponse = require("../helper/response");

module.exports = {
  getUser: async (req, res) => {
    try {
      const response = await userRepo.getUser(req.query);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  getUserById: async (req, res) => {
    try {
      const response = await userRepo.getUserById(req.userPayload.user_id);
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const response = await userRepo.deleteUsers(req.params);
      return sendResponse.success(res, response.status, response.rows);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
  editPassword: (req, res) => {
    userRepo
      .editPassword(req.body, req.userPayload.user_id)
      .then((response) => {
        res.status(response.status).json({
          msg: "Password has been changed",
        });
      })
      .catch((err) => {
        return sendResponse.error(res, err.status || 500, err);
      });
  },
  update: async (req, res) => {
    try {
      const response = await userRepo.update(
        req.body,
        req.userPayload.user_id,
        req.file
      );
      return sendResponse.success(res, response.status, response);
    } catch (err) {
      return sendResponse.error(res, err.status || 500, err);
    }
  },
};
