const userRepo = require("../repo/userRepo");

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
  const { body } = req;
  userRepo
    .register(body)
    .then((response) => {
      res.status(200).json({
        msg: "Register Success",
        // result: response,
        data: {
          ...response.rows[0],
          email: body.email,
          username: body.username,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Email Has Been Used",
      });
    });
};

const editPassword = (req, res) => {
  const { body } = req;
  userRepo
    .editPassword(body)
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

const userController = {
  getUser,
  createUser,
  editUser,
  deleteUser,
  register,
  editPassword,
};

module.exports = userController;
