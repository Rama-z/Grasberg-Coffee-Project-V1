// Import Router
const express = require("express");
const database = require("../config/postgre");
// buat router
const mainRouter = express.Router();

const prefix = "/api/v1";

// Import subrouter
const productsRouter = require("./products");
const promosRouter = require("./promos");
const transactionsRouter = require("./transactions");
const usersRouter = require("./users");
const authRouter = require("./auth");

// import middleware
const imageUpload = require("../middleware/upload");

// Sambungkan subrouter dengan mainrouter
mainRouter.use(`${prefix}/products`, productsRouter);
mainRouter.use(`${prefix}/promos`, promosRouter);
mainRouter.use(`${prefix}/transactions`, transactionsRouter);
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/auth`, authRouter);

// Pemasangan route
// http://localhost:8080/
mainRouter.get("/", (req, res) => {
  res.json({
    msg: "welcome in Grasberg Coffee",
  });
});

mainRouter.get("/verify/:id", function (req, res) {
  client
    .get(req.params.id)
    .then((results) => {
      if (!results)
        res.status(400).send(`
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%">
        <div>
          <image src="https://i.pinimg.com/originals/d0/17/47/d01747c4285afa4e7a6e8656c9cd60cb.png" alt="ceklist" style="width: 75px; height: 75px"/>
        </div>
        <div>
          <p style="font-weight:800;font-size:25px;font-family:Consolas">Bad Request</p>
        </div>
      </div>
      `);
      if (results) {
        const query = `update users set status = 'verified'`;
        database.query(query, (err, result) => {
          if (err) {
            console.log(err);
            res.json({
              msg: "System Error !",
            });
          }
          client.del(req.params.id);
          // res.status(200).send("<h1>Email  is been Successfully verified");
          res.status(200).send(`
          <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%">
            <div>
              <image src="https://www.pngall.com/wp-content/uploads/5/Checklist-Logo.png" alt="ceklist" style="width: 75px; height: 75px"/>
            </div>
            <div>
              <p style="font-weight:800;font-size:25px;font-family:Consolas">Your Email Was Successfully verified</p>
            </div>
          </div>
          `);
        });
      } else {
        res.status(400).send(`
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%">
          <div>
            <image src="https://i.pinimg.com/originals/d0/17/47/d01747c4285afa4e7a6e8656c9cd60cb.png" alt="ceklist" style="width: 75px; height: 75px"/>
          </div>
          <div>
            <p style="font-weight:800;font-size:25px;font-family:Consolas">Bad Request</p>
          </div>
        </div>
        `);
      }
    })
    .catch((err) => {
      res.status(400).send(`
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%">
        <div>
          <image src="https://i.pinimg.com/originals/d0/17/47/d01747c4285afa4e7a6e8656c9cd60cb.png" alt="ceklist" style="width: 75px; height: 75px"/>
        </div>
        <div>
          <p style="font-weight:800;font-size:25px;font-family:Consolas">Bad Request</p>
        </div>
      </div>
      `);
    });
});

// image uplaod
mainRouter.post("/", imageUpload.single("image"), (req, res) => {
  res.json({ file: req.file });
});

// Export routernya
module.exports = mainRouter;
