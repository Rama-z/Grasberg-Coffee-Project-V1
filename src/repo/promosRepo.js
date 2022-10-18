const postgreDb = require("../config/postgre");

const search = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { codes, menu } = queryParams;
    const query =
      "select p.codes, p.discount, p.valid_date, p2.menu, p2.price from promos p join products p2 on p.menu_id = p2.id where lower(p.codes) like lower($1) and lower(p2.menu) like lower($2)";
    const value = [`%${codes}%`, `%${menu}%`];
    postgreDb.query(query, value, (err, result) => {
      if (err) {
        console.log(query);
        console.log(err);
        return reject(err);
      }
      console.log(query);
      return resolve(result);
    });
  });
};

const create = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into promos (codes, discount, valid_date, menu_id) values ($1, $2, $3, $4)";
    const { codes, discount, valid_date, menu_id } = body;
    const value = [codes, discount, valid_date, menu_id];
    postgreDb.query(query, value, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const edit = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update promos set updated_at = CURRENT_TIMESTAMP, ";
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
        console.log(query);
        resolve(response);
      })
      .catch((err) => {
        console.log(query);
        console.log(err);
        reject(err);
      });
  });
};

const repoTrans = {
  search,
  create,
  edit,
};

module.exports = repoTrans;
