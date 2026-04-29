const recipeModel = require("../models/recipeModel");
const recipeStepModel = require("../models/recipeStepModel");
const recipeIngredientModel = require("../models/recipeIngredientModel");
const recipeImageModel = require("../models/recipeImageModel");
const recipeRatingModel = require("../models/recipeRatingModel");

async function createRecipe(req, res, next) {
  try {
    const { title, description } = req.body;
    const author_user_id = req.user.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "title required",
      });
    }
    const id = await recipeModel.create({
      author_user_id,
      title,
      description,
      status: "published",
    });

    res.status(201).json({
      success: true,
      message: "Recipe created",
      transaction_id: id,
    });
  } catch (err) {
    next(err);
  }
}

async function createDraftRecipe(req, res, next) {
  try {
    const { title, description } = req.body;
    const author_user_id = req.user.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "title is required",
      });
    }

    const id = await recipeModel.create({
      author_user_id,
      title,
      description,
      status: "draft",
    });

    return res.status(201).json({
      success: true,
      message: "Draft recipe created",
      transaction_id: id,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllRecipes(req, res, next) {
  try {
    const recipes = await recipeModel.getPublicRecipes();
    res.json({
      success: true,
      data: recipes,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllRecipesAdmin(req, res, next) {
  try {
    const recipes = await recipeModel.getAll();
    return res.json({
      success: true,
      data: recipes,
    });
  } catch (err) {
    next(err);
  }
}

async function getMyRecipes(req, res, next) {
  try {
    const userId = req.user.id;
    const recipes = await recipeModel.getByUserId(userId);

    return res.json({
      success: true,
      message: recipes,
    });
  } catch (err) {
    next(err);
  }
}

async function getRecipeById(req, res, next) {
  try {
    const { id } = req.params;
    const recipe = await recipeModel.getById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    const ingredients = await recipeIngredientModel.getByRecipeId(id);
    const steps = await recipeStepModel.getByRecipeId(id);
    const images = await recipeImageModel.getByRecipeId(id);
    const rating = await recipeRatingModel.getStatsByRecipeId(id);

    res.json({
      success: true,
      data: {
        ...recipe,
        rating,
        images,
        ingredients,
        steps,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function publishRecipe(req, res, next) {
  try {
    const { id } = req.params;

    const recipe = await recipeModel.findByIdAndUser(id, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (recipe.status !== "draft") {
      return res.statur(400).json({
        success: false,
        message: "Only draft recipes can be published",
      });
    }
    await recipeModel.publishById(id);
    const updated = await recipeModel.getById(id);

    return res.json({
      success: true,
      message: "Recipe published",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

async function updateRecipe(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title && !description) {
      return res.status(400).json({
        success: false,
        message: "info required to update",
      });
    }

    const recipe = await recipeModel.findByIdAndUser(id, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await recipeModel.updateById(id, { title, description });

    const updated = await recipeModel.getById(id);

    return res.json({
      success: true,
      message: "Recipe updated",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteRecipe(req, res, next) {
  try {
    const { id } = req.params;

    const recipe = await recipeModel.findByIdAndUser(id, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await recipeModel.softDeleteById(id);

    return res.json({
      success: true,
      message: "Recipe deleted",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  getMyRecipes,
  createRecipe,
  createDraftRecipe,
  publishRecipe,
  updateRecipe,
  deleteRecipe,
  getAllRecipesAdmin,
};
