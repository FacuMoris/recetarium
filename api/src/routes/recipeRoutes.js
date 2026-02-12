const express = require("express");
const recipeController = require("../controllers/recipeController");
const router = express.Router();

router.post("/recipes", recipeController.createRecipe);
router.get("/recipes", recipeController.getAllRecipes);
router.get("/recipes/:id", recipeController.getRecipeById);
router.put("/recipes/:id", recipeController.updateRecipe);
router.delete("/recipes/:id", recipeController.deleteRecipe);

module.exports = router;
