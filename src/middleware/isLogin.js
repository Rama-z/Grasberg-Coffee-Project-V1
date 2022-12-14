const jwt = require("jsonwebtoken");
const JWTR = require("jwt-redis").default;
const client = require("../config/redis");
const jwtr = new JWTR(client);
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
    postgreDb.query(query, [token], (err, result) => {
      if (err) {
        return res.status(500).json({ msg: "Internal Server Error", err });
      }
      if (result.rows.length !== 0)
        return res.status(403).json({ msg: "You have to login", err });
      // verifikasi JWT
      jwtr
        .verify(token, process.env.SECRET_KEY, {
          issuer: process.env.ISSUER_KEY,
        })
        .then((decodedPayload) => {
          req.userPayload = decodedPayload;
          next();
        })
        .catch((err) => {
          if (err.message.includes("jwt expired"))
            return res
              .status(401)
              .json({ msg: "Jwt Expired", data: null, err });
          return res
            .status(401)
            .json({ msg: "You have to login firsta", data: null, err });
        });
    });
  };
};

module.exports = isLogin;
