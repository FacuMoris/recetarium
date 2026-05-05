const express = require("express");

const unitController = require("../controllers/unitController");

const router = express.Router();

router.get("/units", unitController.getUnits);

module.exports = router;
