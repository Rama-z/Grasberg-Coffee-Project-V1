require("dotenv").config();

// Impor Express
const express = require("express");

// import db
const postgreDb = require("./src/config/postgre");

// import mainrouter
const mainRouter = require("./src/route/mainrouter");

// init express application
const server = express();

// Menyiapkan port tempat server berjalan
const PORT = 8080;

// Melakukan koneksi ke database(connect merupakan promise, bisa ditangani dengan callback /pun promise)
postgreDb
  .connect()
  .then(() => {
    // Pastikan DB connect dulu
    console.log("DB Connected");
    // Middleware yang disediakan express untuk parsing body yang bertipe json
    server.use(express.json());
    // Middleware yang disediakan express untuk parsing body yang bertipe urlencode
    server.use(express.urlencoded({ extended: false }));
    // extended true => parsing menggunakan qs library => bisa memproses nested object
    // extended false => parsing menggunakan library queryString => tidak bisa memproses nested object
    // dipasang sebelum mainRouter agar datanya diparsing dulu sebelum digunakan di mainRouter
    // bentuknya body => parsing => query => masuk mainRouter
    // Semua request ke server akan didelegasikan ke main router
    server.use(mainRouter);

    // Server siap menerima request pada port:
    server.listen(PORT, () => {
      console.log(`Server ini berjalan pada port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
