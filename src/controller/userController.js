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
    res.status(200).json({ result: response });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const response = await userRepo.deleteUsers(req.params);
    res.status(200).json({
      result: response,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const userController = { getUser, createUser, editUser, deleteUser };

module.exports = userController;
