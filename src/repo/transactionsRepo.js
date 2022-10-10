const postgreDb = require("../config/postgre");

const searchTrans = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query =
      "select * from transactions where lower(username) like lower($1) and lower(product_name) like lower($2) order by username";
    const values = [
      `%${queryParams.username}%`,
      `%${queryParams.product_name}%`,
    ];
    postgreDb.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const filterTrans = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query = `select u.user_id, t.username, p.menu, p.price, p.varian, p.menu_released, t.delivery_at, t.coupon_codes from transactions t 
      join users u on t.user_id = u.user_id 
      join products p on t.product_name = p.menu 
      join promos p2 on t.coupon_codes = p2.coupon_codes 
      where lower(p.varian) like lower($1);`;
    const values = [`%${queryParams.varian}%`];
    postgreDb.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const sortTrans = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { search, varian, sort, limit } = queryParams;
    const querySearch = search && search !== "" ? `'%${search}%'` : `'%%'`;
    const queryCategories = varian && varian !== "" ? `'%${varian}%'` : `'%%'`;
    let price = "price is not null";
    if (sort) {
      if (sort.toLowerCase() === "price") {
        querySort = "price";
        queryOrder = "asc";
      }
      if (sort.toLowerCase() === "price desc") {
        querySort = "price";
        queryOrder = "desc";
      }
      if (sort.toLowerCase() === "time") {
        querySort = "t.delivery_at";
        queryOrder = "asc";
      }
    }
    const query = `select u.user_id, t.username, p.menu, p.price, p.varian, p.menu_released, t.delivery_at, t.coupon_codes from transactions t 
    join users u on t.user_id = u.user_id 
    join products p on t.product_name = p.menu 
    join promos p2 on t.coupon_codes = p2.coupon_codes 
    where lower(p.menu) like lower(${querySearch}) and 
    lower(p.varian) like lower(${queryCategories}) and ${price} 
    group by u.user_id, t.username, p.menu, p.price, p.varian, p.menu_released, t.delivery_at, t.coupon_codes, t.product_name
    order by ${querySort} ${queryOrder} 
    limit ${limit};`;
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const createTrans = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into transactions (username, product_name, price, delivery_adress, coupon_codes) values ($1, $2, $3, $4, $5)";
    const { username, product_name, price, delivery_adress, coupon_codes } =
      body;
    const value = [
      username,
      product_name,
      price,
      delivery_adress,
      coupon_codes,
    ];
    postgreDb.query(query, value, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const editTrans = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update transactions set ";
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
  searchTrans,
  filterTrans,
  sortTrans,
  createTrans,
  editTrans,
};

module.exports = repoTrans;
