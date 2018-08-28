const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Welcome to Bloccit");
  next()
});

router.get("/marco", (req, res, next) => {
  res.send("polo");
  next()
});

module.exports = router;
