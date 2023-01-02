const database = require("../config/postgre");

const search = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { codes } = queryParams;
    let code = codes || "";
    const query = `select * from promos p where lower(p.codes) like lower('%${code}%') and id != 999 and deleted_at is null order by id asc`;
    const value = [];
    database.query(query, value, (err, result) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, message: "Internal server error", err });
      }
      return resolve({
        status: 200,
        meta: {
          length: result.rows.length,
        },
        data: result.rows,
        message: "Promo success for being shown",
      });
    });
  });
};

const getAllPromo = (queryParams) => {
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
      join = "join transactions t on t.product_id = p.id ";
      transactions = "count(p.id), ";
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
    if (limit && limit > 0) {
      batas = "limit";
      limits = limit;
    }
    const query = `select ${transactions}p.id, p.menu, p.image, p.price, c.category_name, p.created_at, p.updated_at, p.image from products p join categorize c on p.varian_id = c.id ${join} 
    where lower(menu) like lower('%${search}%') ${varian} ${group} ${dec} ${orderBy} ${orderIn} ${batas} ${limits} ${offsets} ${offset}`;
    const value = [];
    database.query(query, value, (err, result) => {
      if (err) {
        return reject({
          status: 500,
          message: "Internal message error",
          err,
        });
      }
      return resolve(result);
    });
  });
};

const create = (body, file) => {
  return new Promise((resolve, reject) => {
    let query =
      "insert into promos (codes, discount, valid_date) values ($1, $2, $3) returning *";
    const { codes, discount, valid_date } = body;
    let value = [codes, discount, valid_date];
    if (file) {
      if (Object.keys(body).length === 0) {
        query = `insert into promos (codes, discount, valid_date, image) values ('unset', 99, 99, $1) returning *`;
        value = [`${file.secure_url}`];
      }
      if (Object.keys(body).length > 0) {
        query = `insert into promos (codes, discount, valid_date, image) values ($1, $2, $3, $4) returning *`;
        value.push(`${file.secure_url}`);
      }
    }
    database.query(query, value, (err, result) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, message: "Internal server error", err });
      }
      return resolve({
        status: 200,
        data: result.rows[0],
        message: "Promo is succesfully created",
      });
    });
  });
};

const edit = (body, params, file) => {
  return new Promise((resolve, reject) => {
    let query = "update promos set updated_at = CURRENT_TIMESTAMP, ";
    const value = [];
    if (Object.keys(body).length === 0) {
      if (!file) {
        return reject({
          status: 400,
          message: "Edit product cancelled, no body for edit",
        });
      }
    }
    if (file) {
      if (Object.keys(body).length === 0) {
        const imageUrl = `${file.secure_url}`;
        query += `image = '${imageUrl}' where id = $1 returning *`;
        value.push(params.id);
      }
      if (Object.keys(body).length > 0) {
        const imageUrl = `${file.secure_url}`;
        query += `image = '${imageUrl}', `;
      }
    }
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2} returning *`;
        value.push(body[key], params.id);
        return;
      }
      query += `${key} = $${idx + 1},`;
      value.push(body[key]);
    });
    database
      .query(query, value)
      .then((response) => {
        if (response.rows.length === 0)
          return reject({ status: 404, message: "Data not found" });
        return resolve({
          status: 200,
          data: response.rows[0],
          message: "Promo is successfully updated",
        });
      })
      .catch((err) => {
        console.log(err);
        return reject({ status: 500, message: "Internal server error", err });
      });
  });
};

const drop = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from promos where id = $1 returning *";
    database.query(query, [Number(params)], (err, result) => {
      if (err) {
        return reject({ status: 500, message: "Internal server error", err });
      }
      if (result.rows.length === 0)
        return reject({ status: 404, message: "Data not found", err });
      return resolve({ status: 200, data: result.rows });
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
