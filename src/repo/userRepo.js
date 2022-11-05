const bcrypt = require("bcrypt");

// const { query } = require("express");
const db = require("../config/postgre");

const getUser = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query =
      "select username, gender, adress from users where lower(username) like lower($1)";
    const value = [`%${queryParams.username}%`];
    db.query(query, value, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const createuser = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into users (username, gender, email, adress) values ($1, $2, $3, $4) ";
    const { username, gender, email, adress } = body;
    db.query(query, [username, gender, email, adress], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const editUsers = (body, queryParams) => {
  return new Promise((resolve, reject) => {
    let query = "update users set ";
    const value = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2};`;
        value.push(body[key], queryParams.id);
        return;
      }
      query += `${key} = $${idx + 1},`;
      value.push(body[key]);
    });
    db.query(query, value)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const deleteUsers = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from users where id = $1";
    // OR => logika atau sql
    // "OR" => string OR
    db.query(query, [params.id], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

// const register = (body) => {
//   return new Promise((resolve, reject) => {
//     const { username, email, pass, gender, adress, phone_number } = body;
//     console.log(username);
//     console.log(email);
//     console.log(pass);
//     console.log(gender);
//     console.log(adress);
//     console.log(phone_number);
//     const getEmailQuery = "select email from users";
//     const input = [];
//     db.query(getEmailQuery, input, (err, response) => {
//       if (err) {
//         return reject({ err });
//       }
//       for (let i = 0; i <= response.rows.length - 1; i++) {
//         if (response.rows[i].email === email) {
//           return reject({ err });
//         }
//       }
//       bcrypt.hash(pass, 10, (err, hashPass) => {
//         if (err) {
//           console.log(err);
//           return reject(err);
//         }
//         const query =
//           "insert into users (username, email, pass, gender, adress, phone_number, roles) values ($1, $2, $3, $4, $5, $6, 'user') returning id";
//         const value = [username, email, hashPass, gender, adress, phone_number];
//         db.query(query, value, (error, result) => {
//           if (error) {
//             return reject(error);
//           }
//           return resolve(result);
//         });
//       });
//     });
//   });
// };

const register = (body) => {
  return new Promise((resolve, reject) => {
    const queries = {
      checkEmailandPhone:
        "select up.phone, u.email from users_profile up left join users u on u.id = up.user_id where phone = $1 or email = $2",
      userInsert:
        "insert into users(email, password, created_at, updated_at, role_id) values($1, $2, to_timestamp($3), to_timestamp($4), $5) returning id",
      profileInsert:
        "insert into users_profile(user_id, phone, created_at, updated_at) values($1, $2, to_timestamp($3), to_timestamp($4))",
    };
    const { checkEmailandPhone, userInsert, profileInsert } = queries;
    const timeStamp = Date.now() / 1000;
    const { email, password, phone } = body;
    db.query(checkEmailandPhone, [phone, email], (error, checkResult) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      if (checkResult.rows.length > 0) {
        const errorMessage = [];
        if (
          checkResult.rows.length > 1 ||
          (checkResult.rows[0].phone == phone &&
            checkResult.rows[0].email == email)
        )
          errorMessage.push(403, "Email and phone number already exist");
        if (checkResult.rows[0].phone == phone)
          errorMessage.push(403, "Phone number already exist");
        if (checkResult.rows[0].email == email)
          errorMessage.push(403, "Email already exist");
        return reject({
          status: errorMessage[0],
          msg: errorMessage[1],
        });
      }
      bcrypt.hash(password, 10, (error, hashedPwd) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "internal server error" });
        }
        const role = 1;
        db.query(
          userInsert,
          [email, hashedPwd, timeStamp, timeStamp, role],
          (error, result) => {
            if (error) {
              console.log(error);
              return reject({ status: 500, msg: "Internal Server Error" });
            }
            db.query(
              profileInsert,
              [result.rows[0].id, phone, timeStamp, timeStamp],
              (error, profileResult) => {
                if (error) {
                  return reject({
                    status: 500,
                    msg: "Internal Server Error",
                  });
                }
                return resolve({
                  status: 201,
                  msg: `Congrats ${body.email}, your account created successfully`,
                });
              }
            );
          }
        );
      });
    });
  });
};
const editPassword = (body, token) => {
  return new Promise((resolve, reject) => {
    const { old_password, new_password } = body;
    const getPwdQuery = "select pass from users where id = $1";
    const getPwdValues = [token];
    db.query(getPwdQuery, getPwdValues, (err, response) => {
      if (err) {
        console.log(err);
        return reject({ err });
      }
      const hashedPassword = response.rows[0].pass;
      bcrypt.compare(old_password, hashedPassword, (err, isSame) => {
        if (err) {
          console.log(err);
          return reject({ err });
        }
        if (!isSame)
          return reject({
            statusCode: 403,
            msg: new Error("Old Password is wrong"),
          });
        bcrypt.hash(new_password, 10, (err, newHashedPassword) => {
          if (err) {
            console.log(err);
            return reject({ err });
          }
          const editPwdQuery = "update users set pass = $1 WHERE id = $2";
          const editPwdValues = [newHashedPassword, token];
          db.query(editPwdQuery, editPwdValues, (err, response) => {
            if (err) {
              console.log(err);
              return reject({ err });
            }
            return resolve(response);
          });
        });
      });
    });
  });
};

const profile = (body, id, file) => {
  return new Promise((resolve, reject) => {
    const timeStamp = Date.now() / 1000;
    const values = [];
    let query = "update users set ";
    let imageUrl = "";
    if (file) {
      imageUrl = `/image/${file.filename} `;
      if (Object.keys(body).length > 0) {
        query += `image = '${imageUrl}', `;
      }
      if (Object.keys(body).length === 0) {
        query += `image = '${imageUrl}', updated_at = to_timestamp($1) where user_id = $2 returning username`;
        values.push(timeStamp, id);
      }
    }
    Object.keys(body).forEach((key, index, array) => {
      if (index === array.length - 1) {
        query += `${key} = $${index + 1}, updated_at = to_timestamp($${
          index + 2
        }) where user_id = $${index + 3} returning username`;
        values.push(body[key], timeStamp, id);
        return;
      }
      query += `${key} = $${index + 1}, `;
      values.push(body[key]);
    });
    console.log(query);
    db.query(query, values, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      let data = {};
      if (file) data = { Image: imageUrl, ...result.rows[0] };
      data = { Image: imageUrl, ...result.rows[0] };
      return resolve({
        status: 200,
        msg: `${result.rows[0].username}, your profile successfully updated`,
        data,
      });
    });
  });
};

const repoUsers = {
  getUser,
  createuser,
  editUsers,
  deleteUsers,
  register,
  editPassword,
  profile,
};

module.exports = repoUsers;
