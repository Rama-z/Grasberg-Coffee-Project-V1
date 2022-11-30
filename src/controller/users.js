const userRepo = require("../repo/users");
const sendResponse = require("../helper/response");

const getUser = async (req, res) => {
  try {
    const response = await userRepo.getUser(req.query);
    return sendResponse.success(res, response.status, response);
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

const getUserById = async (req, res) => {
  try {
    const response = await userRepo.getUserById(req.userPayload.user_id);
    return sendResponse.success(res, response.status, response);
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const response = await userRepo.deleteUsers(req.params);
    return sendResponse.success(res, response.status, response.rows);
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

const register = async (req, res) => {
  try {
    const { body } = req;
    const response = await userRepo.register(body);
    return sendResponse.success(res, response.status, response);
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

const editPassword = (req, res) => {
  userRepo
    .editPassword(req.body, req.userPayload.user_id)
    .then((response) => {
      res.status(response.status).json({
        msg: "Password has been changed",
      });
    })
    .catch((objErr) => {
      const statusCode = objErr.statusCode || err.status;
      res.status(statusCode).json({ msg: "Wrong Old Password " });
    });
};

const update = async (req, res) => {
  try {
    const response = await userRepo.update(
      req.body,
      req.userPayload.user_id,
      req.file
    );
    return sendResponse.success(res, response.status, response);
  } catch (err) {
    return sendResponse.error(res, err.status, err);
  }
};

const userController = {
  getUser,
  deleteUser,
  register,
  editPassword,
  getUserById,
  update,
};

module.exports = userController;
