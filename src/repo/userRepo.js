// const { query } = require("express");
const postgreDb = require("../config/postgre");

const getUser = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query =
      "select username, gender, delivery_adress from users where lower(username) like lower($1)";
    const value = [`%${queryParams.username}%`];
    postgreDb.query(query, value, (err, result) => {
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
      "insert into users (username, gender, email, delivery_adress) values ($1, $2, $3, $4)";
    const { username, gender, email, delivery_adress } = body;
    postgreDb.query(
      query,
      [username, gender, email, delivery_adress],
      (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      }
    );
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
    postgreDb
      .query(query, value)
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
    postgreDb.query(query, [params.id], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

const repoUsers = {
  getUser,
  createuser,
  editUsers,
  deleteUsers,
};

module.exports = repoUsers;
