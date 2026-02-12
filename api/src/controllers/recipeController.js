const recipeModel = require("../models/recipeModel");

async function createRecipe(req, res, next) {
  try {
    const { author_user_id, title, description } = req.body;

    if (!author_user_id || !title) {
      return res.status(400).json({
        success: false,
        message: "author_user_id and title required",
      });
    }
    const id = await recipeModel.create({
      author_user_id,
      title,
      description,
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

async function getAllRecipes(req, res, next) {
  try {
    const recipes = await recipeModel.getAll();
    res.json({
      success: true,
      data: recipes,
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

    res.json({
      success: true,
      data: recipe,
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
    const affected = await recipeModel.updateById(id, { title, description });

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }
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
    const affected = await recipeModel.softDeleteById(id);

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }
    return res.json({
      success: true,
      message: "Recipe updated",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
