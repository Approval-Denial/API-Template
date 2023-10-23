const express = require("express").Router();

express.get("/", function (req, res) {
  res.json({
    message: "Hello",
  });
});


module.exports = express;