const { Pool } = require("pg");
require("dotenv").config();
// isi info database
const db = new Pool({
  host: process.env.DB_HOST_DEV,
  user: process.env.DB_USER_DEV,
  database: process.env.DB_DATABASE_DEV,
  password: process.env.DB_PASSWORD_DEV,
  port: process.env.DB_PORT_DEV,
});

// export
module.exports = db;
