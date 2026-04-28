const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

router.get("/me/recipes", checkJwt, currentUser, recipeController.getMyRecipes);
router.post("/recipes", checkJwt, currentUser, recipeController.createRecipe);
router.post(
  "/recipes/drafts",
  checkJwt,
  currentUser,
  recipeController.createDraftRecipe,
);
router.patch(
  "/recipes/:id/publish",
  checkJwt,
  currentUser,
  recipeController.publishRecipe,
);
router.get("/recipes", recipeController.getAllRecipes);
router.get("/recipes/:id", recipeController.getRecipeById);
router.put(
  "/recipes/:id",
  checkJwt,
  currentUser,
  recipeController.updateRecipe,
);
router.delete(
  "/recipes/:id",
  checkJwt,
  currentUser,
  recipeController.deleteRecipe,
);

module.exports = router;
