const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const database = require("../config/postgre");
module.exports = {
  login: (body) => {
    return new Promise((resolve, reject) => {
      const { email, pass } = body;
      // 1. apakah ada email yang bersangkutan di DB
      const getPasswordByEmailQuery =
        "SELECT id, username, pass, roles FROM users WHERE email = $1";
      const getPasswordByEmailValues = [email];
      database.query(
        getPasswordByEmailQuery,
        getPasswordByEmailValues,
        (err, response) => {
          if (err) {
            console.log(err);
            return reject({ err });
          }
          if (response.rows.length === 0)
            return reject({
              err: new Error("Email/Password is Wrong panjang"),
              statusCode: 401,
            });
          // 2. apakah password yang tertera di DB sama dengan yang di input
          const hashedPassword = response.rows[0].pass;
          console.log(pass);
          console.log(hashedPassword);
          bcrypt.compare(pass, hashedPassword, (err, isSame) => {
            if (err) {
              console.log(err);
              return reject({ err });
            }
            if (!isSame)
              return reject({
                err: new Error("Email/Password is Wrong compare"),
                statusCode: 401,
              });
            // 3. proses login => create jwt => return jwt to user
            const payload = {
              //1
              user_id: response.rows[0].id,
              name: response.rows[0].username,
              email,
              role: response.rows[0].roles,
            };
            console.log("jwt lewat sini");
            jwt.sign(
              payload,
              process.env.SECRET_KEY,
              {
                expiresIn: "100m",
                issuer: process.env.ISSUER_KEY,
              },
              (err, token) => {
                if (err) {
                  console.log(err);
                  return reject({ err });
                }
                return resolve({
                  token,
                  id: payload.user_id,
                  name: payload.name,
                  email: payload.email,
                  role: payload.role,
                });
              }
            );
          });
        }
      );
    });
  },

  logout: (token) => {
    return new Promise((resolve, reject) => {
      const query = "insert into blacklist(token) values($1)";
      database.query(query, [token], (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve({ message: "Logout Success." });
      });
    });
  },
};
