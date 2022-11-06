// import database
const postgreDb = require("../config/postgre");

const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select p.id, p.menu, p.price, p.image, c.category_name, p.description from products p join categorize c on c.id = p.varian_id left join transactions t on t.product_id = p.id where p.id = $1 group by p.id, menu, p.price , image, c.category_name , description";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      if (result.rows === 0) return reject(error);
      return resolve(result);
    });
  });
};

const searchAndFilter = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { search, filter, order_by, order_in } = queryParams;
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
    const query = `select p.id, p.menu, p.price, c.category_name, p.created_at, p.updated_at from products p join categorize c on p.varian_id = c.id where lower(menu) like lower('%${search}%') ${varian} ${dec} ${orderBy} ${orderIn}`;
    if (order_by === "transactions") {
      query =
        "select count(*), p.id, p.menu, p.image, p.price, c.category_name, p.created_at, p.updated_at  from transactions t join products p on t.product_id = p.id join categorize c on c.id = p.varian_id group by product_id, p.menu, p.id, c.category_name order by count(*) desc";
    }
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

const paginasi2 = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { search, filter, order_in, order_by } = queryParams;
    let varian = "";
    if (
      (filter && filter === "1") ||
      (filter && filter === "2") ||
      (filter && filter === "3") ||
      (filter && filter === "4")
    ) {
      varian = `and varian_id = ${filter}`;
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
    const query = `select count(*) from products p join categorize c on p.varian_id = c.id where lower(menu) like lower('%${search}%') ${varian}`;
    const value = [];
    postgreDb.query(query, value, (err, result) => {
      if (err) {
        // console.log(query);
        console.log(err);
        console.log("error 1");
        return reject(err);
      }
      // console.log(query);
      console.log("success 1");
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
    postgreDb.query(query, value, (err, result) => {
      if (err) {
        // console.log(query);
        console.log("error");
        console.log(err);
        return reject(err);
      }
      console.log("harusnya success");
      console.log(query);
      return resolve(result);
    });
  });
};

const create = (body, file) => {
  return new Promise((resolve, reject) => {
    let query =
      "insert into products (menu, price, varian_id, description) values ($1, $2, $3, $4)";
    const { menu, price, varian_id, description } = body;
    let value = [menu, price, varian_id, description];
    if (file) {
      console.log(file);
      console.log("masuk sini");
      if (Object.keys(body).length === 0) {
        query = `insert into products (menu, price, varian_id, description, image) values ('unset', 99, 99, 'default', $1) returning id`;
        value = [`${file.filename}`];
      }
      if (Object.keys(body).length > 0) {
        query = `insert into products (menu, price, varian_id, description, image) values ($1, $2, $3, $4, $5) returning id`;
        value.push(`${file.filename}`);
      }
    }
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
    let query = "update products set ";
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
        reject(err);
      });
  });
};

const editProduct = (body, params, file) => {
  return new Promise((resolve, reject) => {
    let query = "update products set ";
    const value = [];
    if (file) {
      if (Object.keys(body).length === 0) {
        const imageUrl = `${file.filename}`;
        query += `image = '${imageUrl}' where id = $1 returning menu, price, varian_id, image`;
        value.push(params.id);
      }
      if (Object.keys(body).length > 0) {
        const imageUrl = `${file.filename}`;
        query += `image = '${imageUrl}', `;
      }
    }
    Object.keys(body).forEach((keys, idx, array) => {
      if (idx === array.length - 1) {
        query += `${keys} = $${idx + 1} where id = $${
          idx + 2
        } returning menu, price, varian_id, image`;
        value.push(body[keys], params.id);
        return;
      }
      query += `${keys} = $${idx + 1}, `;
      value.push(body[keys]);
    });
    postgreDb
      .query(query, value)
      .then((response) => {
        console.log(query);
        resolve(response);
      })
      .catch((err) => {
        console.log(query);
        reject(err);
      });
  });
};

const drop = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from products where id = $1 returning *";
    postgreDb.query(query, [Number(params)], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const repoProducts = {
  getProductById,
  searchAndFilter,
  paginasi,
  create,
  edit,
  paginasi2,
  editProduct,
  drop,
};

module.exports = repoProducts;
