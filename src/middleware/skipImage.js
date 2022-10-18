const express = require("express");
const app = express();

app.get("/image/:id", (req, res, next) => {
  // if the user ID is 0, skip to the next route
  if (req.body) return next("route");
  // otherwise pass the control to the next middleware function in this stack
  return next();
});
