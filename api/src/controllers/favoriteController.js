const favoriteModel = require("../models/favoriteModel");
const { get } = require("../routes/recipeRoutes");

async function addFavorite(req, res, next) {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    await favoriteModel.addFavorite(userId, recipeId);

    return res.status(201).json({
      success: true,
      message: "Added to favorites",
    });
  } catch (err) {
    next(err);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    const affected = await favoriteModel.removeFavorite(userId, recipeId);

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    return res.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (err) {
    next(err);
  }
}

async function getMyFavorites(req, res, next) {
  try {
    const userId = req.user.id;
    const favorites = await favoriteModel.getFavoritesByUser(userId);

    return res.json({
      success: true,
      data: favorites,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  getMyFavorites,
};
