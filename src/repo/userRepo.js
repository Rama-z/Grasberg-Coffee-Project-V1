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

const register = (body) => {
  return new Promise((resolve, reject) => {
    const { username, email, pass, gender, adress } = body;
    const getEmailQuery = "select email from users";
    const input = [];
    db.query(getEmailQuery, input, (err, response) => {
      if (err) {
        return reject({ err });
      }
      for (let i = 0; i <= response.rows.length - 1; i++) {
        if (response.rows[i].email === email) {
          return reject({ err });
        }
      }
      // hash password
      bcrypt.hash(pass, 10, (err, hashPass) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        const query =
          "insert into users (username, email, pass, gender, adress) values ($1, $2, $3, $4, $5) returning id";
        const value = [username, email, hashPass, gender, adress];
        db.query(query, value, (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        });
      });
    });
  });
};

const editPassword = (body) => {
  return new Promise((resolve, reject) => {
    const { old_password, new_password, user_id } = body;
    const getPwdQuery = "SELECT pass FROM users WHERE id = $1";
    const getPwdValues = [user_id];
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
          const editPwdQuery = "UPDATE users SET pass = $1 WHERE id = $2";
          const editPwdValues = [newHashedPassword, user_id];
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

const repoUsers = {
  getUser,
  createuser,
  editUsers,
  deleteUsers,
  register,
  editPassword,
};

module.exports = repoUsers;
