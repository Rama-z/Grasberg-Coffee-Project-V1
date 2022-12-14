const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWTR = require("jwt-redis").default;
const database = require("../config/postgre");
const client = require("../config/redis");
const jwtr = new JWTR(client);

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
            return reject({
              status: 501,
              Message: "Internal Server Error",
              err,
            });
          }
          if (response.rows.length === 0)
            return reject({
              status: 401,
              message: "Email/Password is Wrong",
              err,
            });
          // 2. apakah password yang tertera di DB sama dengan yang di input
          const hashedPassword = response.rows[0].pass;
          bcrypt.compare(pass, hashedPassword, (err, isSame) => {
            if (err) {
              return reject({
                status: 501,
                message: "Internal Server Error",
                err,
              });
            }
            if (!isSame)
              return reject({
                status: 401,
                message: "Email/Password is Wrong",
              });
            // 3. proses login => create jwt => return jwt to user
            const payload = {
              //1
              user_id: response.rows[0].id,
              name: response.rows[0].username,
              email,
              role: response.rows[0].roles,
            };
            jwtr
              .sign(payload, process.env.SECRET_KEY, {
                expiresIn: "1d",
                issuer: process.env.ISSUER_KEY,
              })
              .then((token) => {
                return resolve({
                  token,
                  id: payload.user_id,
                  name: payload.name,
                  email: payload.email,
                  role: payload.role,
                });
              });
          });
        }
      );
    });
  },
  register: (body) => {
    return new Promise((resolve, reject) => {
      const queries = {
        checkEmailAndPhone:
          "select u.phone, u.email from users u where phone = $1  or email = $2",
        userInsert:
          "insert into users(email, pass, created_at, updated_at, roles, gender, username, address, phone) values($1, $2, to_timestamp($3), to_timestamp($4), $5, $6, $7, $8, $9) returning id",
      };
      const { checkEmailAndPhone, userInsert } = queries;
      const timeStamp = Date.now() / 1000;
      const { email, pass, phone, gender, username, address } = body;
      database.query(checkEmailAndPhone, [phone, email], (err, result) => {
        if (err) {
          return reject({ status: 500, message: "Internal Server Error", err });
        }
        if (result.rows.length > 0) {
          const errorMessage = [];
          if (
            result.rows.length > 1 ||
            (result.rows[0].phone == phone && result.rows[0].email == email)
          )
            errorMessage.push(403, "Email and phone number already exist");
          if (result.rows[0].phone == phone)
            errorMessage.push(403, "Phone number already exist");
          if (result.rows[0].email == email)
            errorMessage.push(403, "Email already exist");
          return reject({
            status: errorMessage[0],
            message: errorMessage[1],
            err,
          });
        }
        bcrypt.hash(pass, 10, (err, hashedPwd) => {
          if (err) {
            return reject({
              status: 502,
              message: "internal server error",
              err,
            });
          }
          const role = "user";
          database.query(
            userInsert,
            [
              email,
              hashedPwd,
              timeStamp,
              timeStamp,
              role,
              gender,
              username,
              address,
              phone,
            ],
            (err, result) => {
              if (err) {
                return reject({
                  status: 501,
                  message: `Internal Server Error`,
                  err,
                });
              }
              return resolve({
                status: 201,
                data: result.rows,
                message: `Congrats ${body.email}, your account created successfully`,
              });
            }
          );
        });
      });
    });
  },

  logout: (token) => {
    return new Promise((resolve, reject) => {
      jwtr.destroy(token.jti).then((res) => {
        if (!res)
          reject({ status: 501, message: "Error Response Logout", err });
        resolve({ status: 201, message: "Logout Success." });
      });
    });
  },
};
