const authRepo = require("../repo/auth");

module.exports = {
  login: (req, res) => {
    authRepo
      .login(req.body)
      .then((response) => {
        res.status(200).json({
          data: response,
          msg: "Login Success",
        });
      })
      .catch((ObjErr) => {
        const statusCode = ObjErr.statusCode || 500;
        res.status(statusCode).json({ msg: ObjErr.err.message });
      });
  },
};
