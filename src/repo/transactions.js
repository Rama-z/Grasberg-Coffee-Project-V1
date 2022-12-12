const database = require("../config/postgre");

const create = (body, token, file) => {
  return new Promise((resolve, reject) => {
    let query =
      "insert into transactions (product_id, delivery_adress, promo_id, total, user_id, payment_id, status) values ($1, $2, $3, $4, $5, $6, 'pending') returning *";
    const { product_id, delivery_adress, promo_id, total, payment_id } = body;
    let value = [
      product_id,
      delivery_adress,
      promo_id ? promo_id : 99,
      total,
      token,
      payment_id ? payment_id : 1,
    ];
    if (file) {
      query = `insert into transactions (product_id, delivery_adress, promo_id, total, user_id, payment_id, status, image) values ($1, $2, $3, $4, $5, $6, 'pending', $7) returning *`;
      value.push(`${file.secure_url}`);
    }
    console.log("sini3");
    database.query(query, value, (err, result) => {
      if (err) {
        console.log(err);
        if (!product_id)
          return reject({
            status: 404,
            msg: "Input your product",
          });
        if (!total)
          return reject({
            status: 404,
            msg: "Input total amount of your purchasing",
          });
        return reject({
          status: 500,
          msg: "Internal Server Error",
        });
      }
      return resolve({
        status: 200,
        msg: "Transactions successfully created",
        data: result.rows[0],
      });
    });
  });
};

const editTrans = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update transactions set ";
    const value = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2} returning *`;
        value.push(body[key], params.id);
        return;
      }
      query += `${key} = $${idx + 1}, `;
      value.push(body[key]);
    });
    database
      .query(query, value)
      .then((response) => {
        if (response.rows.length === 0)
          return reject({
            status: 404,
            msg: "Transaction not found",
          });
        resolve({
          status: 200,
          msg: "Transaction successfully Edited",
          data: response.rows[0],
        });
      })
      .catch((err) => {
        console.log(query);
        console.log(err);
        reject({
          status: 500,
          msg: "internal Server Error",
        });
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
    database.query(query, value, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          msg: "internal server error",
        });
      }
      return resolve({
        status: 200,
        msg: "success",
        data: result,
      });
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
    database.query(query, value, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          msg: "Internal server error",
        });
      }
      console.log(result.rows);
      return resolve({
        status: 200,
        msg: "Transactions success to be displayed",
        data: result.rows,
      });
    });
  });
};

const history = (queryparams, token) => {
  return new Promise((resolve, reject) => {
    let query =
      "select u.email, p.menu, t.total, t.status, p.image from transactions t inner join users u on u.id = t.user_id inner join products p on p.id = t.product_id where u.id = $1";
    let queryLimit = "";
    let link = `http://localhost:8080/api/v1/transactions/history?`;
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
    database.query(query, [token], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          msg: "Internal server error",
        });
      }
      database.query(queryLimit, values, (err, queryresult) => {
        if (err) {
          console.log(err);
          return reject({
            status: 501,
            msg: "Internal server error",
          });
        }
        if (queryresult.rows.length == 0)
          return reject({
            status: 404,
            msg: "History not found",
          });
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
          };
          return resolve({
            status: 200,
            msg: "History successfully showned",
            meta: sendResponse,
            data: queryresult.rows,
          });
        }
        sendResponse = {
          dataCount: result.rowCount,
          next: resNext,
          prev: resPrev,
          totalPage: null,
        };
        return resolve({
          status: 200,
          msg: "History successfully showned",
          meta: sendResponse,
          data: queryresult.rows,
        });
      });
    });
  });
};

const drop = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query = "delete from transactions where id = $1 returning *";
    const value = [queryParams];
    database.query(query, value, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          msg: "Internal server error",
        });
      }
      if (result.rows.length === 0)
        return reject({ status: 404, msg: "Data not found" });
      return resolve({
        status: 200,
        msg: "Delete transactions success",
        data: result.rows[0],
      });
    });
  });
};

const repoTrans = {
  create,
  editTrans,
  paginasi,
  paginasi2,
  history,
  drop,
};

module.exports = repoTrans;
