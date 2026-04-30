const recipeModel = require("../models/recipeModel.js");
const recipeRatingModel = require("../models/recipeRatingModel.js");

async function rateRecipe(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be 1 - 5",
      });
    }

    const recipe = await recipeModel.getById(recipeId);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    await recipeRatingModel.upsertRating({
      recipeId,
      userId: req.user.id,
      rating,
    });

    const stats = await recipeRatingModel.getStatsByRecipeId(recipeId);

    return res.json({
      success: true,
      message: "Rating saved",
      data: stats,
    });
  } catch (err) {
    next(err);
  }
}

async function getRecipeRating(req, res, next) {
  try {
    const { id: recipeId } = req.params;

    const stats = await recipeRatingModel.getStatsByRecipeId(recipeId);

    return res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
}

async function getMyRating(req, res, next) {
  try {
    const { id: recipeId } = req.params;

    const rating = await recipeRatingModel.getUserRating(recipeId, req.user.id);

    return res.json({
      success: true,
      data: rating,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteMyRating(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const affected = await recipeRatingModel.deleteRating(
      recipeId,
      req.user.id,
    );

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }
    return res.json({
      success: true,
      message: "Rating deleted",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  rateRecipe,
  getRecipeRating,
  getMyRating,
  deleteMyRating,
};
