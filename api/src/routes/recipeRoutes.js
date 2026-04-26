const express = require("express");
const checkJwt = require("../middleware/auth");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

router.post("/recipes", checkJwt, recipeController.createRecipe);
router.get("/recipes", recipeController.getAllRecipes);
router.get("/recipes/:id", recipeController.getRecipeById);
router.put("/recipes/:id", checkJwt, recipeController.updateRecipe);
router.delete("/recipes/:id", checkJwt, recipeController.deleteRecipe);

module.exports = router;
