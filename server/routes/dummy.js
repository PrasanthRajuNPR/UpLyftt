const express = require("express");
const router = express.Router();

const {dummy} = require("../Controllers/dummyController");

router.get("/name",dummy);

module.exports = router 