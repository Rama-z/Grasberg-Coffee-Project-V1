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

const register = (body) => {
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
  register,
  editPassword,
  getUserById,
  update,
};

module.exports = repoUsers;
