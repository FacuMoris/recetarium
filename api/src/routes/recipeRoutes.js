const express = require("express");
const recipeController = require("../controllers/recipeController");
const router = express.Router();

router.get("/recipes", recipeController.getAllRecipes);
router.post("/recipes", recipeController.createRecipe);
router.get("/recipes/:id", recipeController.getRecipeById);

module.exports = router;
