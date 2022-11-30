// import database
const database = require("../config/postgre");

const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select p.id, p.menu, p.price, p.image, c.category_name, p.description from products p join categorize c on c.id = p.varian_id left join transactions t on t.product_id = p.id where p.id = $1 group by p.id, menu, p.price , image, c.category_name , description";
    database.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          msg: "Internal message error",
        });
      }
      if (result.rows === 0)
        return reject({ status: 404, msg: "Product not found" });
      return resolve({
        status: 200,
        data: {
          id: result.rows[0].id,
          menu: result.rows[0].menu,
          price: result.rows[0].price,
          image: result.rows[0].image,
          category_name: result.rows[0].category_name,
          description: result.rows[0].description,
        },
      });
    });
  });
};

const getAllProduct = (queryParams) => {
  return new Promise((resolve, reject) => {
    let { search, filter, order_by, order_in, page, limit } = queryParams;
    let join = "";
    let transactions = "";
    let group = "";
    let dec = "order by";
    let varian = "";
    let limits = "";
    let batas = "";
    let offset = "";
    let offsets = "";
    if (!search) {
      search = "";
    }
    if (!order_in) {
      order_in = "";
    }
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
      order_by = "";
      if (
        (order_in && order_in === "asc") ||
        (order_in && order_in === "desc")
      ) {
        order_in = "";
      }
    }
    if (order_by === "transactions") {
      join = "join transactions t on t.product_id = p.id ";
      transactions = "count(p.id), ";
      group = "group by p.id, c.category_name";
      dec = "";
      order_by = "";
      if (
        (order_in && order_in === "asc") ||
        (order_in && order_in === "desc")
      ) {
        order_in = "";
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
    where lower(menu) like lower('%${search}%') ${varian} ${group} ${dec} ${order_by} ${order_in} ${batas} ${limits} ${offsets} ${offset}`;
    const value = [];
    database.query(query, value, (err, result) => {
      if (err) {
        console.log(query);
        console.log(err);
        return reject({
          status: 500,
          msg: "Internal message error",
        });
      }
      return resolve(result);
    });
  });
};

const getAllProduct2 = (queryParams) => {
  return new Promise((resolve, reject) => {
    let { search, filter, order_by } = queryParams;
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
    }
    const query = `select count(*) from products p join categorize c on p.varian_id = c.id where lower(menu) like lower('%${search}%') ${varian}`;
    const value = [];
    database.query(query, value, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          msg: "Internal message error",
        });
      }
      return resolve(result);
    });
  });
};

const create = (body, file) => {
  return new Promise((resolve, reject) => {
    let query =
      "insert into products (menu, price, varian_id, description) values ($1, $2, $3, $4) returning *";
    const { menu, price, varian_id, description } = body;
    let value = [menu, price, varian_id, description];
    if (file) {
      if (Object.keys(body).length === 0) {
        query = `insert into products (menu, price, varian_id, description, image) values ('unset', 99, 99, 'default', $1) returning *`;
        value = [`${file.filename}`];
      }
      if (Object.keys(body).length > 0) {
        query = `insert into products (menu, price, varian_id, description, image) values ($1, $2, $3, $4, $5) returning *`;
        value.push(`${file.filename}`);
      }
    }
    database.query(query, value, (err, result) => {
      if (err) {
        return reject({
          status: 500,
          msg: "Internal message error",
        });
      }
      console.log(result.rows[0]);
      return resolve({
        status: 200,
        data: result.rows[0],
        msg: "Product successfully added",
      });
    });
  });
};

const editProduct = (body, params, file) => {
  return new Promise((resolve, reject) => {
    let query = "update products set ";
    const value = [];
    if (file) {
      console.log(file.filename);
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
    console.log(query);
    database
      .query(query, value)
      .then((response) => {
        if (response.rows.length === 0) {
          return reject({
            status: 404,
            msg: "Product not found, can't update product",
          });
        }
        console.log("lewat sini");
        resolve({
          status: 200,
          msg: "Edit data success",
          data: {
            menu: response.rows[0].menu,
            price: response.rows[0].price,
            varian:
              response.rows[0].varian_id === 1
                ? "Coffee"
                : response.rows[0].varian_id === 2
                ? "Non Coffee"
                : response.rows[0].varian_id === 3
                ? "Foods"
                : "",
            image: file.filename,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        reject({
          status: 500,
          msg: "Failed to edit product, Internal message error",
        });
      });
  });
};

const drop = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from products where id = $1 returning *";
    database.query(query, [Number(params)], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          msg: "Failed to delete product",
        });
      }
      if (result.rows.length === 0)
        return reject({
          status: 404,
          msg: "Product not found, can't update product",
        });
      return resolve({
        status: 200,
        msg: "Delete product success",
      });
    });
  });
};

const repoProducts = {
  getProductById,
  getAllProduct,
  getAllProduct2,
  create,
  editProduct,
  drop,
};

module.exports = repoProducts;
