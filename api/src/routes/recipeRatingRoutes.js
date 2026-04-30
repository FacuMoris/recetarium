const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser.js");
const recipeRatingController = require("../controllers/recipeRatingController.js");

const router = express.Router();

router.get("/recipes/:id/rating", recipeRatingController.getRecipeRating);

router.get(
  "/recipes/:id/rating/me",
  checkJwt,
  currentUser,
  recipeRatingController.getMyRating,
);

router.post(
  "/recipes/:id/rating",
  checkJwt,
  currentUser,
  recipeRatingController.rateRecipe,
);

router.delete(
  "/recipes/:id/rating",
  checkJwt,
  currentUser,
  recipeRatingController.deleteMyRating,
);

module.exports = router;
