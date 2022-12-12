const jwt = require("jsonwebtoken");
const postgreDb = require("../config/postgre");
const isLogin = () => {
  return (req, res, next) => {
    const token = req.header("x-access-token");
    // cek apakah tokennya ada
    if (!token) {
      res.status(401).json({
        msg: "Login First",
      });
    }
    // Cek jwt dari tabel blacklist
    const query = "select token from blacklist where token = $1";
    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
      }
      if (result.rows.length !== 0)
        return res.status(403).json({ msg: "You have to login" });
      // verifikasi JWT
      jwt.verify(token, process.env.SECRET_KEY, (err, decodedPayload) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            msg: err.name,
          });
        }
        req.userPayload = decodedPayload;
        req.token = token;
        next();
      });
    });
  };
};

module.exports = isLogin;
