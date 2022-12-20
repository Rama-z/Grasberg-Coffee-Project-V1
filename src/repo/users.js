const bcrypt = require("bcrypt");
const database = require("../config/postgre");

const getUser = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query = `select id, roles, username, email, gender, phone, address, image, birthday from users where lower(username) like lower('%${queryParams.username}%') and lower(roles) like lower('user')`;
    const value = [];
    database.query(query, value, (err, result) => {
      if (err) {
        return reject({ status: 500, message: "Internal Server Error", err });
      }
      return resolve({
        status: 200,
        data: result.rows,
      });
    });
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select username, firstname, lastname, username, gender, birthday, address, image, phone, email from users where id = $1";
    database.query(query, [id], (err, result) => {
      if (err) {
        return reject({ status: 500, message: "Internal Server Error", err });
      }
      return resolve({ status: 200, data: result.rows });
    });
  });
};

const deleteUsers = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from users where id = $1";
    database.query(query, [params.id], (err, result) => {
      if (err) {
        return reject({ status: 500, message: "Internal Server Error", err });
      }
      resolve({ status: 200, data: result.rows });
    });
  });
};

const editPassword = (body, token) => {
  return new Promise((resolve, reject) => {
    const { old_password, new_password } = body;
    const getPwdQuery = "select pass from users where id = $1";
    const getPwdValues = [token];
    database.query(getPwdQuery, getPwdValues, (err, response) => {
      if (err) {
        return reject({ status: 500, message: "Internal Server Error", err });
      }
      const hashedPassword = response.rows[0].pass;
      bcrypt.compare(old_password, hashedPassword, (err, isSame) => {
        if (err) {
          return reject({ status: 500, message: "Internal Server Error", err });
        }
        if (!isSame)
          return reject({
            status: 403,
            message: "Old Password is wrong",
            err,
          });
        bcrypt.hash(new_password, 10, (err, newHashedPassword) => {
          if (err) {
            return reject({
              status: 500,
              message: "Internal Server Error",
              err,
            });
          }
          const editPwdQuery = "update users set pass = $1 WHERE id = $2";
          const editPwdValues = [newHashedPassword, token];
          database.query(editPwdQuery, editPwdValues, (err, response) => {
            if (err) {
              return reject({
                status: 500,
                message: "Internal Server Error",
                err,
              });
            }
            return resolve({ status: 200, data: response.rows });
          });
        });
      });
    });
  });
};

const update = (body, id, file) => {
  return new Promise((resolve, reject) => {
    const { username, firstname, lastname, email, gender, address, phone } =
      body;
    const queryUser = `select * from users where id = ${id}`;
    database.query(queryUser, (errUser, resultUser) => {
      if (errUser) {
        console.log(err);
        return reject({
          status: 501,
          msg: "internal server error",
        });
      }
      const values = [];
      let query = "update users set ";
      let imageUrl = "";
      if (file) {
        imageUrl = `${file.secure_url}`;
        if (Object.keys(body).length > 0) {
          query += ` image = '${imageUrl}', `;
        }
        if (Object.keys(body).length === 0) {
          query += ` image = '${imageUrl}', where id = $1 returning id, username, email, phone, gender, address, birthday, image `;
          values.push(id);
        }
      }
      Object.keys(body).forEach((key, index, array) => {
        if (index === array.length - 1) {
          query += ` ${key} = $${index + 1} where id = $${
            index + 2
          } returning id, username, email, phone, gender, address, birthday, image`;
          values.push(body[key], id);
          return;
        }
        query += ` ${key} = $${index + 1}, `;
        values.push(body[key]);
      });
      console.log(query);
      database.query(query, values, (err, result) => {
        if (err) {
          console.log(err);
          return reject({ status: 500, message: "Internal Server Error", err });
        }
        let data = {};
        if (file) data = { Image: imageUrl, ...result.rows[0] };
        data = { ...result.rows[0] };
        return resolve({
          status: 200,
          message: `${result.rows[0].username}, your profile successfully updated`,
          data,
        });
      });
    });
  });
};

const repoUsers = {
  getUser,
  deleteUsers,
  editPassword,
  getUserById,
  update,
};

module.exports = repoUsers;
