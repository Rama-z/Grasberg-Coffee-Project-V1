const jwt = require("jsonwebtoken");
module.exports = () => {
  return (req, res, next) => {
    const token = req.header("x-access-token");
    // cek apakah tokennya ada
    if (!token)
      return res.status(403).json({
        msg: "Login First",
        data: null,
      });
    // verifikasi JWT
    jwt.verify(
      token,
      process.env.SECRET_KEY,
      { issuer: process.env.ISSUER_KEY },
      (err, decodedPayload) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            msg: err.message,
            data: null,
          });
        }
        // cek role
        req.userPayload = decodedPayload;
        next();
      }
    );
  };
};
