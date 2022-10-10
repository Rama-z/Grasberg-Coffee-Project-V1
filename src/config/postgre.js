const { Pool } = require("pg");

// isi info database
const db = new Pool({
  host: "localhost",
  user: "barista",
  database: "coffeeshop",
  password: "grasbergcoffee",
  port: 5432,
});

// export
module.exports = db;
