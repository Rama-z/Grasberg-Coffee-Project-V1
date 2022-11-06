const postgreDb = require("../config/postgre");

const sortTrans = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { search, filter, order_by, order_in } = queryParams;
    let transactions = "";
    let group = "";
    let dec = "order by";
    let orderBy = order_by;
    let orderIn = order_in;
    let varian = "";
    if (
      (filter && filter === "1") ||
      (filter && filter === "2") ||
      (filter && filter === "3") ||
      (filter && filter === "4")
    ) {
      varian = `and varian_id = ${filter}`;
    }
    if (
      order_by !== "created_at" &&
      order_by !== "price" &&
      order_by !== "transactions"
    ) {
      dec = "";
      orderBy = "";
      if (
        (order_in && order_in === "asc") ||
        (order_in && order_in === "desc")
      ) {
        orderIn = "";
      }
    }
    if (order_by === "transactions") {
      transactions = "count(*), ";
      group =
        "group by p.id, u.username, c.category_name, t.created_at, p2.codes, t.id";
      dec = "";
      orderBy = "";
      if (
        (order_in && order_in === "asc") ||
        (order_in && order_in === "desc")
      ) {
        orderIn = "";
      }
    }
    const query = `select ${transactions} t.id, u.username, p.menu, p.price, c.category_name, p.created_at, t.created_at, p2.codes from transactions t 
    join users u on t.user_id = u.id 
    join products p on t.product_id = p.id 
    join promos p2 on t.promo_id = p2.id 
    join categorize c on p.varian_id = c.id
    where lower(menu) like lower('%${search}%') 
    ${varian} ${group} ${dec} ${orderBy} ${orderIn}`;
    const value = [];
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

const createTrans = (body, token, file) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into transactions (product_id, delivery_adress, promo_id, total, user_id, payment_id, status) values ($1, $2, $3, $4, $5, $6, 'pending')";
    let { product_id, delivery_adress, promo_id, total, payment_id } = body;
    if (!promo_id) {
      promo_id = 99;
    }
    let value = [
      product_id,
      delivery_adress,
      promo_id,
      total,
      token,
      payment_id,
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

const paginasi2 = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { search, filter } = queryParams;
    let varian = "";
    if (
      (filter && filter === "1") ||
      (filter && filter === "2") ||
      (filter && filter === "3") ||
      (filter && filter === "4")
    ) {
      varian = `and varian_id = ${filter}`;
    }
    const query = `select count(*) from transactions t 
    join users u on t.user_id = u.id 
    join products p on t.product_id = p.id 
    join promos p2 on t.promo_id = p2.id 
    join categorize c on p.varian_id = c.id 
    where lower(menu) like lower('%${search}%') ${varian}`;
    const value = [];
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

const paginasi = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { search, filter, order_by, order_in, page, limit } = queryParams;
    let join = "";
    let transactions = "";
    let group = "";
    let dec = "order by";
    let orderBy = order_by;
    let orderIn = order_in;
    let varian = "";
    let limits = "";
    // ganti
    let batas = "";
    let offset = "";
    let offsets = "";
    if (
      (filter && filter === "1") ||
      (filter && filter === "2") ||
      (filter && filter === "3") ||
      (filter && filter === "4")
    ) {
      varian = `and varian_id = ${filter}`;
    }
    if (order_by !== "created_at" && order_by !== "price") {
      dec = "";
      orderBy = "";
      if (
        (order_in && order_in === "asc") ||
        (order_in && order_in === "desc")
      ) {
        orderIn = "";
      }
    }
    if (order_by === "transactions") {
      // join = "join products p on p.id = t.product_id ";
      transactions = "count(t.product_id), ";
      group = "group by p.id, c.category_name";
      dec = "";
      orderBy = "";
      if (
        (order_in && order_in === "asc") ||
        (order_in && order_in === "desc")
      ) {
        orderIn = "";
      }
    }
    if (page && page > 0) {
      batas = "limit";
      offset = (page - 1) * limit;
      if (limit && limit > 0) {
        limits = limit;
        offsets = "offset";
      }
    }
    const query = `select ${transactions}p.id, p.menu, p.price, c.category_name, p.created_at, p.updated_at from transactions t 
    join products p on t.product_id = p.id
    join categorize c on p.varian_id = c.id 
    ${join} where lower(menu) like lower('%${search}%') ${varian} ${group} ${dec} ${orderBy} ${orderIn} ${batas} ${limits} ${offsets} ${offset}`;
    const value = [];
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

const users2 = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { search, filter, order_by, order_in, user_id } = queryParams;
    let varian = "";
    let group = "";
    if (
      (filter && filter === "1") ||
      (filter && filter === "2") ||
      (filter && filter === "3") ||
      (filter && filter === "4")
    ) {
      varian = `and varian_id = ${filter}`;
    }
    if (order_by === "transactions") {
      group = "group by u.id";
    }
    const query = `select count(t.product_id) from transactions t 
    join users u on t.user_id = u.id 
    join products p on t.product_id = p.id 
    join promos p2 on t.promo_id = p2.id 
    join categorize c on p.varian_id = c.id 
    where u.id = $1 and lower(menu) like lower('%${search}%') ${varian} ${group}`;
    const value = [Number(user_id)];
    postgreDb.query(query, value, (err, result) => {
      if (err) {
        // console.log(query);
        console.log(err);
        return reject(err);
      }
      // console.log(query);
      return resolve(result);
    });
  });
};

const history = (queryparams, token) => {
  return new Promise((resolve, reject) => {
    let query =
      "select u.email, p.menu, t.total, t.status, p.image from transactions t inner join users u on u.id = t.user_id inner join products p on p.id = t.product_id where u.id = $1";
    let queryLimit = "";
    let link = `http://localhost:8080/coffee/transactions/history?`;
    let values = [token];
    if (queryparams.page && queryparams.limit) {
      let page = parseInt(queryparams.page);
      let limit = parseInt(queryparams.limit);
      let offset = (page - 1) * limit;
      queryLimit = query + ` limit $2 offset $3`;
      values.push(limit, offset);
    } else {
      queryLimit = query;
    }
    postgreDb.query(query, [token], (err, result) => {
      if (err) {
        console.log(err);
        return reject(new Error("Internal Server Error"));
      }
      postgreDb.query(queryLimit, values, (err, queryresult) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        if (queryresult.rows.length == 0)
          return reject(new Error("History Not Found"));
        let resNext = null;
        let resPrev = null;
        if (queryparams.page && queryparams.limit) {
          let page = parseInt(queryparams.page);
          let limit = parseInt(queryparams.limit);
          let start = (page - 1) * limit;
          let end = page * limit;
          let next = "";
          let prev = "";
          const dataNext = Math.ceil(result.rowCount / limit);
          if (start <= result.rowCount) {
            next = page + 1;
          }
          if (end > 0) {
            prev = page - 1;
          }
          if (parseInt(next) <= parseInt(dataNext)) {
            resNext = `${link}page=${next}&limit=${limit}`;
          }
          if (parseInt(prev) !== 0) {
            resPrev = `${link}page=${prev}&limit=${limit}`;
          }
          let sendResponse = {
            dataCount: result.rowCount,
            next: resNext,
            prev: resPrev,
            totalPage: Math.ceil(result.rowCount / limit),
            data: queryresult.rows,
          };
          // console.log(result);
          return resolve(sendResponse);
        }
        let sendResponse = {
          dataCount: result.rowCount,
          next: resNext,
          prev: resPrev,
          totalPage: null,
          data: queryresult.rows,
        };
        return resolve(sendResponse);
      });
    });
  });
};

const repoTrans = {
  sortTrans,
  createTrans,
  editTrans,
  paginasi,
  paginasi2,
  history,
  users2,
};

module.exports = repoTrans;
