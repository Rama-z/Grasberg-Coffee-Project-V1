const bcrypt = require("bcrypt");
const database = require("../config/postgre");

const getUser = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query = `select id, roles, username, email, gender, phone, adress, image, birthday from users where lower(username) like lower('%${queryParams.username}%') and lower(roles) like lower('user')`;
    const value = [];
    database.query(query, value, (err, result) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, msg: "Internal Server Error" });
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
      "select username, firstname, lastname, username, gender, birthday, adress, image, phone, email from users where id = $1";
    database.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, msg: "Internal Server Error" });
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
        console.log(err);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      resolve({ status: 200, data: result.rows });
    });
  });
};

const editPassword = (body, token) => {
  return new Promise((resolve, reject) => {
    console.log("test2");
    const { old_password, new_password } = body;
    const getPwdQuery = "select pass from users where id = $1";
    const getPwdValues = [token];
    database.query(getPwdQuery, getPwdValues, (err, response) => {
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
          database.query(editPwdQuery, editPwdValues, (err, response) => {
            if (err) {
              console.log(err);
              return reject({ status: 500, msg: "Internal Server Error" });
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
    console.log("success");
    const values = [];
    let query = "update users set ";
    let imageUrl = "";
    if (file) {
      imageUrl = `${file.filename}`;
      if (Object.keys(body).length > 0) {
        query += ` image = '${imageUrl}', `;
      }
      if (Object.keys(body).length === 0) {
        query += ` image = '${imageUrl}', where id = $1 returning id, username, email, phone, gender, adress, birthday `;
        values.push(id);
      }
    }
    Object.keys(body).forEach((key, index, array) => {
      if (index === array.length - 1) {
        query += ` ${key} = $${index + 1} where id = $${
          index + 2
        } returning id, username, email, phone, gender, adress, birthday`;
        values.push(body[key], id);
        return;
      }
      query += ` ${key} = $${index + 1}, `;
      values.push(body[key]);
    });
    database.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      let data = {};
      if (file) data = { Image: imageUrl, ...result.rows[0] };
      data = { ...result.rows[0] };
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
  deleteUsers,
  editPassword,
  getUserById,
  update,
};

module.exports = repoUsers;
