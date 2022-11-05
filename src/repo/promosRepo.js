const postgreDb = require("../config/postgre");

const search = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { codes, menu } = queryParams;
    const query =
      "select p.codes, p.discount, p.valid_date, p2.menu, p2.price, p.image from promos p join products p2 on p.menu_id = p2.id where lower(p.codes) like lower($1) and lower(p2.menu) like lower($2)";
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

const create = (body, params, file) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into promos (codes, discount, valid_date, menu_id, image) values ($1, $2, $3, $4, $5)";
    const { codes, discount, valid_date, menu_id } = body;
    const value = [
      codes,
      discount,
      valid_date,
      menu_id,
      `/image/${file.filename}`,
    ];
    postgreDb.query(query, value, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const edit = (body, params, file) => {
  return new Promise((resolve, reject) => {
    let query = "update promos set updated_at = CURRENT_TIMESTAMP, ";
    const value = [];
    if (file) {
      if (Object.keys(body).length === 0) {
        const imageUrl = `${file.filename}`;
        query += `image = '${imageUrl}' where id = $1 returning codes, discount, menu_id, valid_date, image`;
        value.push(params.id);
      }
      if (Object.keys(body).length > 0) {
        const imageUrl = `${file.filename}`;
        query += `image = '${imageUrl}', `;
      }
    }
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

const drop = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from promos where id = $1 returning *";
    postgreDb.query(query, [Number(params)], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const repoTrans = {
  search,
  create,
  edit,
  drop,
};

module.exports = repoTrans;
