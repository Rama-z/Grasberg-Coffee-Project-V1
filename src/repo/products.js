// import database
const database = require("../config/postgre");

module.exports = {
  getProduct: (params, api) => {
    return new Promise((resolve, reject) => {
      const { search, sort, filter, page, limit, promo } = params;
      let sqlSearch = !search || search === "" ? "" : search;
      let sqlLimit = !limit || limit === "" ? 5 : limit;
      let sqlPromo = !promo || promo === "" ? 0 : 999;
      let sqlFilter = "";
      if (filter === "coffee") sqlFilter = "only coffee";
      if (filter === "nonCoffee") sqlFilter = "non coffee";
      if (filter === "food") sqlFilter = "food";
      if (filter === "beverage") sqlFilter = "coffee";
      let sqlSort = "";
      if (sort === "popular") sqlSort = "order by count(ti.product_id) desc";
      if (sort === "oldest") sqlSort = "order by p.created_at asc";
      if (sort === "newest") sqlSort = "order by p.created_at desc";
      if (sort === "cheapest") sqlSort = "order by p.price asc";
      if (sort === "priciest") sqlSort = "order by p.price desc";
      let offset =
        !page || page === "1" ? 0 : (parseInt(page) - 1) * parseInt(sqlLimit);
      let query = `select p.id, p.menu, c.category_name, p.price, p.image, p2.discount, p.description from products p join categorize c on c.id = p.varian_id left join transaction_item ti on ti.product_id = p.id join promos p2 on p2.id = p.promo_id where lower(p.menu) like lower('%${sqlSearch}%') and lower(c.category_name) like lower('%${sqlFilter}%') and p.promo_id != ${sqlPromo} and p.deleted_at is null group by p.id, c.category_name, p.created_at, p2.discount ${sqlSort} limit ${sqlLimit} offset ${offset}`;
      let countQuery = `select count(distinct p.id) as count from products p join categorize c on c.id = p.varian_id left join transaction_item ti on ti.product_id = p.id join promos p2 on p2.id = p.promo_id where lower(p.menu) like lower('%${sqlSearch}%') and lower(c.category_name) like lower('%${sqlFilter}%') and p.promo_id != ${sqlPromo} and p.deleted_at is null`;
      let link = `${api}/api/v1/products?`;
      if (search) link + `search=${search}`;
      if (sort) link + `sort=${sort}`;
      if (filter) link + `filter=${filter}`;
      database.query(countQuery, (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 501,
            message: "Internal Server Errorr",
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
  },
  getProductById: (id) => {
    return new Promise((resolve, reject) => {
      const query =
        "select p.id, p.menu, p.price, p.image, c.category_name, p.description, p.promo_id, p2.codes, p2.discount from products p join categorize c on c.id = p.varian_id left join transaction_item ti on ti.product_id = p.id join promos p2 on p2.id = p.promo_id where p.id = $1 group by p.id, menu, p.price , p.image, c.category_name, p2.codes, p.description, p2.discount";
      database.query(query, [id], (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            message: "Internal message error",
            err,
          });
        }
        if (result.rows === 0)
          return reject({ status: 404, message: "Product not found", err });
        console.log(result.rows[0]);
        return resolve({
          status: 200,
          data: {
            id: result.rows[0].id,
            menu: result.rows[0].menu,
            price: result.rows[0].price,
            image: result.rows[0].image,
            category_name: result.rows[0].category_name,
            description: result.rows[0].description,
            discount: result.rows[0].discount,
            promo_id: result.rows[0].promo_id,
            promo_codes: result.rows[0].codes,
          },
        });
      });
    });
  },
  create: (body, file) => {
    return new Promise((resolve, reject) => {
      let query =
        "insert into products (menu, price, varian_id, description, promo_id) values ($1, $2, $3, $4, $5) returning *";
      const { menu, price, varian_id, description, promo_id } = body;
      let value = [menu, price, varian_id, description, promo_id];
      if (file) {
        if (Object.keys(body).length === 0) {
          query = `insert into products (menu, price, varian_id, description, promo_id, image) values ('unset', 99, 99, 'default', 999, $1) returning *`;
          value = [`${file.secure_url}`];
        }
        if (Object.keys(body).length > 0) {
          query = `insert into products (menu, price, varian_id, description, promo_id, image) values ($1, $2, $3, $4, $5, $6) returning *`;
          value.push(`${file.secure_url}`);
        }
      }
      database.query(query, value, (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            message: "Internal message error",
            err,
          });
        }
        return resolve({
          status: 200,
          data: result.rows[0],
          message: "Product successfully added",
        });
      });
    });
  },
  editProduct: (body, params, file) => {
    return new Promise((resolve, reject) => {
      let query = "update products set ";
      const value = [];
      if (file) {
        if (Object.keys(body).length === 0) {
          const imageUrl = `${file.secure_url}`;
          query += `image = '${imageUrl}' where id = $1 returning menu, price, varian_id, image`;
          value.push(params.id);
        }
        if (Object.keys(body).length > 0) {
          const imageUrl = `${file.secure_url}`;
          query += `image = '${imageUrl}', `;
        }
      }
      Object.keys(body)
        .filter(
          (keys) =>
            keys !== "category_name" &&
            keys !== "promo_codes" &&
            keys !== "id" &&
            keys !== "discount"
        )
        .forEach((keys, idx, array) => {
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
              message: "Product not found, can't update product",
            });
          }
          if (!file) {
            return resolve({
              status: 200,
              message: "Edit data success",
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
              },
            });
          }
          return resolve({
            status: 200,
            message: "Edit data success",
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
              image: file.secure_url,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          reject({
            status: 500,
            message: "Failed to edit product, Internal message error",
            err,
          });
        });
    });
  },
  drop: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from products where id = $1 returning *";
      database.query(query, [Number(params)], (err, result) => {
        if (err) {
          return reject({
            status: 500,
            message: "Failed to delete product",
            err,
          });
        }
        if (result.rows.length === 0)
          return reject({
            status: 404,
            message: "Product not found, can't update product",
            err,
          });
        return resolve({
          status: 200,
          message: "Delete product success",
        });
      });
    });
  },
};
