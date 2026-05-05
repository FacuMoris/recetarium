const recipeModel = require("../models/recipeModel");
const recipeIngredientModel = require("../models/recipeIngredientModel");
const ingredientModel = require("../models/ingredientModel");
const unitModel = require("../models/unitModel");

async function addIngredient(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const { ingredient_id, quantity, unit_id, note } = req.body;

    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!ingredient_id) {
      return res.status(400).json({
        success: false,
        message: "Ingredient_id is required",
      });
    }

    const ingredient = await ingredientModel.getById(ingredient_id);

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: "Ingredient not found",
      });
    }

    if (unit_id) {
      const unit = await unitModel.getById(unit_id);
      if (!unit) {
        return res.status(404).json({
          succes: false,
          message: "Unit not found",
        });
      }
    }
    await recipeIngredientModel.addIngredient({
      recipeId,
      ingredientId: ingredient_id,
      quantity,
      unitId: unit_id,
      note,
    });

    return res.status(201).json({
      success: true,
      message: "Ingredient added",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Ingredient already exists",
      });
    }

    next(err);
  }
}

async function getIngredients(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const ingredients = await recipeIngredientModel.getByRecipeId(recipeId);

    return res.json({
      success: true,
      data: ingredients,
    });
  } catch (err) {
    next(err);
  }
}

async function updateIngredient(req, res, next) {
  try {
    const { id: recipeId, ingredientId } = req.params;
    const { quantity, unit_id, note } = req.body;

    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }
    if (unit_id !== undefined && unit_id !== null) {
      const unit = await unitModel.getById(unit_id);

      if (!unit) {
        return res.status(404).json({
          success: false,
          message: "Unit not found",
        });
      }
    }
    if (quantity === undefined && unit_id === undefined && note === undefined) {
      return res.status(400).json({
        success: false,
        message: "Info required to update",
      });
    }

    const affected = await recipeIngredientModel.updateIngredient(
      recipeId,
      ingredientId,
      {
        quantity,
        unitId: unit_id,
        note,
      },
    );

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Ingredient not found",
      });
    }

    const ingredients = await recipeIngredientModel.getByRecipeId(recipeId);

    return res.json({
      success: true,
      message: "Ingredient update",
      data: ingredients,
    });
  } catch (err) {
    next(err);
  }
}

async function removeIngredient(req, res, next) {
  try {
    const { id: recipeId, ingredientId } = req.params;

    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const affected = await recipeIngredientModel.removeIngredient(
      recipeId,
      ingredientId,
    );

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Ingredient not found",
      });
    }

    return res.json({
      success: true,
      message: "Ingredient removed from recipe",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addIngredient,
  getIngredients,
  updateIngredient,
  removeIngredient,
};
