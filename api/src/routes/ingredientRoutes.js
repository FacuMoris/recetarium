const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser");
const ingredientController = require("../controllers/ingredientController");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

router.get("/ingredients", ingredientController.getIngredients);

router.post(
  "/ingredients",
  checkJwt,
  currentUser,
  ingredientController.createIngredient,
);

router.delete(
  "/ingredients/:id",
  checkJwt,
  currentUser,
  requireRole("admin"),
  ingredientController.deleteIngredient,
);

module.exports = router;
