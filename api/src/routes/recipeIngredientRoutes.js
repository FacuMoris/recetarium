const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser");
const recipeIngredientController = require("../controllers/recipeIngredientController");

const router = express.Router();

router.post(
  "/recipes/:id/ingredients",
  checkJwt,
  currentUser,
  recipeIngredientController.addIngredient,
);

router.get(
  "/recipes/:id/ingredients",
  recipeIngredientController.getIngredients,
);

router.put(
  "/recipes/:id/ingredients/:ingredientId",
  checkJwt,
  currentUser,
  recipeIngredientController.updateIngredient,
);

router.delete(
  "/recipes/:id/ingredients/:ingredientId",
  checkJwt,
  currentUser,
  recipeIngredientController.removeIngredient,
);

module.exports = router;
