const express = require("express");
const router = express.Router();
const checkJwt = require("../middleware/auth");
const authController = require("../controllers/authController");

router.get("/auth/me", checkJwt, authController.me);

module.exports = router;
