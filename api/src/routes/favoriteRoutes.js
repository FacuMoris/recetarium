const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser");
const favoriteController = require("../controllers/favoriteController");

const router = express.Router();

router.get(
  "/me/favorites",
  checkJwt,
  currentUser,
  favoriteController.getMyFavorites,
);

router.post(
  "/favorites/:recipeId",
  checkJwt,
  currentUser,
  favoriteController.addFavorite,
);

router.delete(
  "/favorites/:recipeId",
  checkJwt,
  currentUser,
  favoriteController.removeFavorite,
);

module.exports = router;
