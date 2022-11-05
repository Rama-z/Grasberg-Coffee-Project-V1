const userRepo = require("../repo/userRepo");
const sendResponse = require("../helper/response");

const getUser = async (req, res) => {
  try {
    const response = await userRepo.getUser(req.query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const response = await userRepo.createuser(req.body);
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: "internal Server Error",
    });
  }
};

const editUser = async (req, res) => {
  try {
    const response = await userRepo.editUsers(req.body, req.params);
    res.status(200).json({ result: response.rows });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const response = await userRepo.deleteUsers(req.params);
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const register = (req, res) => {
  userRepo
    .register(req.body)
    .then((response) => {
      console.log("harusnya berhasil controller");
      console.log(response.rows[0]);
      return res.status(200).json({
        msg: "Register Success",
        data: {
          ...response.rows[0],
          email: body.email,
          username: body.username,
        },
      });
    })
    .catch((err) => {
      console.log("controllerError");
      console.log(err);
      res.status(500).json({
        msg: "Email Has Been Useed",
      });
    });
};

const editPassword = (req, res) => {
  userRepo
    .editPassword(req.body, req.userPayload.user_id)
    .then((response) => {
      res.status(200).json({
        msg: "Password has been changed",
        data: null,
      });
    })
    .catch((objErr) => {
      const statusCode = objErr.statusCode || 500;
      res.status(statusCode).json({ msg: "Wrong Old Password " });
    });
};

const profile = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }
    const response = await userRepo.profile(
      req.body,
      req.userPayload.user_id,
      req.file
    );
    // response.rows[0].image = `images/${req.file.filename}`;
    sendResponse.success(res, 200, {
      msg: "Edit Profile Success",
      data: response.rows,
    });
  } catch (err) {
    console.log("asda");
    sendResponse.error(res, 500, "Internal Server Error");
  }
};

const userController = {
  getUser,
  createUser,
  editUser,
  deleteUser,
  register,
  editPassword,
  profile,
};

module.exports = userController;
