const postgreDb = require("../config/postgre");

const searchPromos = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query =
      "select * from promos where lower(coupon_codes) like lower($1) and lower(menu) like lower($2) order by valid_date";
    const values = [`%${queryParams.coupon_code}%`, `%${queryParams.menu}%`];
    postgreDb.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const createPromos = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into promos (coupon_codes, menu, discount, valid_date) values ($1, $2, $3, $4)";
    const { coupon_codes, menu, discount, valid_date } = body;
    const value = [coupon_codes, menu, discount, valid_date];
    postgreDb.query(query, value, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const editPromos = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update promos set ";
    const value = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2};`;
        value.push(body[key], params.id);
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

const repoTrans = {
  searchPromos,
  createPromos,
  editPromos,
};

module.exports = repoTrans;
