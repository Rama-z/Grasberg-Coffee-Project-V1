const database = require("../config/postgre");

const create = (body, id) => {
  return new Promise((resolve, reject) => {
    let query =
      "insert into transactions ( user_id, delivery_address, promo_id, payment_id, payment_method, total, status, delivery_method, delivery_time) values ($1, $2, $3, $4, $5, $6, 'pending', $7, $8) returning *";
    const {
      delivery_address,
      promo_id,
      payment_method,
      total_price,
      delivery_method,
      delivery_time,
    } = body;
    let delivery_times = delivery_time;
    if (delivery_time === "now") delivery_times = "now()";
    const payment_id = `Grasberg-${Math.floor(
      Math.random() * 100000000000000000000
    )}`;
    let value = [
      id,
      delivery_address,
      promo_id ? promo_id : 999,
      payment_id,
      payment_method,
      total_price,
      delivery_method,
      delivery_times,
    ];
    database.query(query, value, (err, result) => {
      if (err) {
        console.log(err);
        if (!total_price)
          return reject({
            status: 404,
            message: "Input total amount of your purchasing",
            err,
          });
        return reject({
          status: 500,
          message: "Internal Server Error",
          err,
        });
      }
      return resolve({
        status: 200,
        message: "Transactions successfully created",
        data: result.rows[0],
      });
    });
  });
};

const createItem = async (products, transactionId) => {
  return await Promise.all(
    products.map((product) => {
      return new Promise((resolve, reject) => {
        const promo_id = product.promo_id || 999;
        let query =
          "insert into transaction_item (transaction_id, product_id, size_id, quantity, promo_id, subtotal) values ($1, $2, $3, $4, $5, $6) returning *";
        let values = [
          transactionId,
          product.product_id,
          product.size_id,
          product.quantity,
          promo_id,
          product.subtotal,
        ];
        database.query(query, values, (err, result) => {
          if (err) {
            console.log(err);
            return reject({
              status: 500,
              message: "Internal Server Error",
              err,
            });
          }
          return resolve(result.rows[0]);
        });
      });
    })
  );
};

const editTrans = (body, params) => {
  return new Promise((resolve, reject) => {
    const { deleted_at } = body;
    let query = "update transactions set ";
    // if (deleted_at === "delete")
    //   query = "update transactions set deleted_at = now(), ";
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
    console.log(query);
    database
      .query(query, value)
      .then((response) => {
        if (response.rows.length === 0)
          return reject({
            status: 404,
            message: "Transaction not found",
            err,
          });
        resolve({
          status: 200,
          message: "Transaction successfully Edited",
          data: response.rows[0],
        });
      })
      .catch((err) => {
        console.log(err);
        reject({
          status: 500,
          message: "internal Server Error",
          err,
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
        return reject({
          status: 500,
          message: "internal server error",
          err,
        });
      }
      return resolve({
        status: 200,
        message: "success",
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
        return reject({
          status: 500,
          message: "Internal server error",
          err,
        });
      }
      return resolve({
        status: 200,
        message: "Transactions success to be displayed",
        data: result.rows,
      });
    });
  });
};

const history = (queryparams, id) => {
  return new Promise((resolve, reject) => {
    let query =
      "select * from transactions t join users u on u.id = t.user_id join transaction_item ti on ti.transaction_id = t.id join products p on p.id = ti.product_id where u.id = $1";
    let queryLimit = "";
    let link = `http://localhost:8080/api/v1/transactions/history?`;
    let values = [id];
    if (queryparams.page && queryparams.limit) {
      let page = parseInt(queryparams.page);
      let limit = parseInt(queryparams.limit);
      let offset = (page - 1) * limit;
      queryLimit = query + ` limit $2 offset $3`;
      values.push(limit, offset);
    } else {
      queryLimit = query;
    }
    database.query(query, [id], (err, result) => {
      if (err) {
        return reject({
          status: 500,
          message: "Internal server error",
          err,
        });
      }
      database.query(queryLimit, values, (err, queryresult) => {
        if (err) {
          return reject({
            status: 501,
            message: "Internal server error",
            err,
          });
        }
        if (queryresult.rows.length == 0)
          return reject({
            status: 404,
            message: "History not found",
            err,
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
            message: "History successfully showned",
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
          message: "History successfully showned",
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
    console.log(query);
    database.query(query, value, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          message: "Internal server error",
          err,
        });
      }
      if (result.rows.length === 0)
        return reject({ status: 404, message: "Data not found", err });
      return resolve({
        status: 200,
        message: "Delete transactions success",
        data: result.rows[0],
      });
    });
  });
};

const getHistory = (params, userId, api) => {
  return new Promise((resolve, reject) => {
    const { sort, page, limit } = params;
    let sqlLimit = !limit || limit === "" ? 5 : limit;
    let sqlSort = "";
    if (sort === "oldest") sqlSort = "order by p.created_at asc";
    if (sort === "newest") sqlSort = "order by p.created_at desc";
    if (sort === "cheapest") sqlSort = "order by t.total asc";
    if (sort === "priciest") sqlSort = "order by t.total desc";
    let offset =
      !page || page === "1" ? 0 : (parseInt(page) - 1) * parseInt(sqlLimit);
    let query = `select t.id, ti.product_id, p.menu, t.delivery_address, t.user_id, t.payment_id, t.total, t.status, p.image, p2.codes from transactions t join transaction_item ti on t.id = ti.transaction_id join products p on p.id = ti.product_id join promos p2 on p2.id = p.promo_id where t.deleted_at is null and t.user_id = ${userId} ${sqlSort} limit ${sqlLimit} offset ${offset}`;
    let countQuery = `select count(t.id) as count from transactions t join transaction_item ti on ti.transaction_id = t.id join products p on p.id = ti.product_id join promos p2 on p2.id = p.promo_id where t.deleted_at is null and t.user_id = ${userId}`;
    let link = `${api}/api/v1/transactions?`;
    if (sort) link + `sort=${sort}`;
    database.query(countQuery, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 501,
          message: "Internal Server Error",
          err,
        });
      }
      const totalData = result.rows[0].count;
      const currentPage = page ? parseInt(page) : 1;
      const totalPage =
        parseInt(sqlLimit) > totalData
          ? 1
          : Math.ceil(totalData / parseInt(sqlLimit));
      const prev =
        currentPage === 1
          ? null
          : link + `page=${currentPage - 1}&limit=${parseInt(sqlLimit)}`;
      const next =
        currentPage === totalPage
          ? null
          : link + `page=${currentPage + 1}&limit=${parseInt(sqlLimit)}`;
      const meta = {
        page: currentPage,
        totalPage,
        limit: parseInt(sqlLimit),
        totalData: parseInt(totalData),
        prev,
        next,
      };
      database.query(query, (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 502,
            message: "Internal Server Error",
            err,
          });
        }
        if (result.rows.length === 0)
          return reject({
            status: 404,
            message: "Data Not Found",
            err,
          });
        return resolve({
          status: 200,
          message: "List Product",
          data: result.rows,
          meta,
        });
      });
    });
  });
};

const midTransHandler = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "update transactions set status = 'paid' where id = $1 returning *";
    const value = [body.transaction_id];
    database.query(query, value, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          message: "Internal server Error",
          err,
        });
      }
      if (result.rows.length === 0) {
        return reject({
          status: 404,
          message: "Data not found",
          err,
        });
      }
      return resolve({
        status: 200,
        message: "Payment success",
        result,
      });
    });
  });
};
const repoTrans = {
  create,
  createItem,
  editTrans,
  paginasi,
  paginasi2,
  history,
  getHistory,
  drop,
  midTransHandler,
};

module.exports = repoTrans;
