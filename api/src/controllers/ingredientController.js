const ingredientModel = require("../models/ingredientModel");

async function getIngredients(req, res, next) {
  try {
    const ingredients = await ingredientModel.getAll();

    return res.json({
      success: true,
      data: ingredients,
    });
  } catch (err) {
    next(err);
  }
}

async function createIngredient(req, res, next) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is required",
      });
    }

    const id = await ingredientModel.create({ name, description });

    return res.status(201).json({
      success: true,
      message: "Ingredient created",
      transaction_id: id,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteIngredient(req, res, next) {
  try {
    const { id } = req.params;

    const affected = await ingredientModel.softDeleteById(id);

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Ingredient not found",
      });
    }

    return res.json({
      success: true,
      message: "Ingredient deleted",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getIngredients,
  createIngredient,
  deleteIngredient,
};
