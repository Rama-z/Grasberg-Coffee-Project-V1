// import database
const postgreDb = require("../config/postgre");

const getProducts = () => {
  return new Promise((resolve, reject) => {
    // Asumsi query params selalu berisi menu and varian
    const query = "select * from products"; // where lower(menu) like lower(%1) and lower(varian) like lower($2)";
    // const values = [`%${queryParams.menu}%`, `%${queryParams.varian}`];
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const sortProducts = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { search, varian, sort } = queryParams;
    const querySearch = search && search === "" ? `'%%'` : `'%${search}%'`;
    const queryVarian = varian && varian === "" ? `'%%'` : `'%${varian}%'`;
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
        querySort = "menu_released";
        queryOrder = "asc";
      }
    }
    const query = `select * from products 
    where lower(menu) like lower(${querySearch}) and 
    lower(varian) like lower(${queryVarian}) and ${price} 
    order by ${querySort} ${queryOrder};`;
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const getDynamic = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query =
      "select * from products where lower(menu) like lower($1) and lower(varian) like lower($2) order by price";
    const values = [`%${queryParams.menu}%`, `%${queryParams.varian}%`];
    postgreDb.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const createProduct = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into products (menu, price, varian) values ($1, $2, $3)";
    const { menu, price, varian } = body;
    const value = [menu, price, varian];
    postgreDb.query(query, value, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const editProduct = (body, params) => {
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
        console.log(err);
        reject(err);
      });
  });
};

const repoProducts = {
  getProducts,
  sortProducts,
  getDynamic,
  createProduct,
  editProduct,
};

module.exports = repoProducts;
