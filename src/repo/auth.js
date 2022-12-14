const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWTR = require("jwt-redis").default;
const database = require("../config/postgre");
const client = require("../config/redis");
const jwtr = new JWTR(client);

module.exports = {
  login: (body) => {
    console.log("a");
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
        checkEmailandPhone:
          "select u.phone, u.email from users u where phone = $1  or email = $2",
        userInsert:
          "insert into users(email, pass, created_at, updated_at, roles, gender, username, adress, phone) values($1, $2, to_timestamp($3), to_timestamp($4), $5, $6, $7, $8, $9) returning id",
      };
      const { checkEmailandPhone, userInsert } = queries;
      const timeStamp = Date.now() / 1000;
      const { email, pass, phone, gender, username, adress } = body;
      database.query(checkEmailandPhone, [phone, email], (error, result) => {
        if (error) {
          return reject({ status: 500, msg: "Internal Server Error" });
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
            msg: errorMessage[1],
          });
        }
        bcrypt.hash(pass, 10, (error, hashedPwd) => {
          if (error) {
            return reject({ status: 502, msg: "internal server error" });
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
              adress,
              phone,
            ],
            (err, result) => {
              if (err) {
                console.log(err);
                return reject({
                  status: 501,
                  msg: `Internal Server Error`,
                });
              }
              return resolve({
                status: 201,
                data: result.rows,
                msg: `Congrats ${body.email}, your account created successfully`,
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
        if (!res) resolve("success");
        resolve({ message: "Logout Success." });
      });
      // const query = "insert into blacklist(token) values($1)";
      // database.query(query, [token], (error, result) => {
      //   if (error) {
      //     console.log(error);
      //     return reject(error);
      //   }
      //   return resolve({ message: "Logout Success." });
      // });
    });
  },
};
