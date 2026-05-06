const recipeModel = require("../models/recipeModel");
const taxonomyModel = require("../models/taxonomyModel");
const recipeTaxonomyModel = require("../models/recipeTaxonomyModel");

async function addTaxonomy(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const { taxonomy_id } = req.body;

    if (!taxonomy_id) {
      return res.status(400).json({
        success: false,
        message: "taxonomy_id required",
      });
    }

    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const taxonomy = await taxonomyModel.getById(taxonomy_id);

    if (!taxonomy) {
      return res.status(404).json({
        success: false,
        message: "Taxonomy not found",
      });
    }

    await recipeTaxonomyModel.addTaxonomy(recipeId, taxonomy_id);

    const taxonomies = await recipeTaxonomyModel.getByRecipeId(recipeId);

    return res.status(201).json({
      success: true,
      message: "Taxonomy added to recipe",
      data: taxonomies,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Taxonomy already exists in recipe",
      });
    }
    next(err);
  }
}

async function getTaxonomies(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const taxonomies = await recipeTaxonomyModel.getByRecipeId(recipeId);

    return res.json({
      success: true,
      data: taxonomies,
    });
  } catch (err) {
    next(err);
  }
}

async function removeTaxonomy(req, res, next) {
  try {
    const { id: recipeId, taxonomyId } = req.params;
    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);
    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const affected = await recipeTaxonomyModel.removeTaxonomy(
      recipeId,
      taxonomyId,
    );

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "taxonomy not found in recipe",
      });
    }

    const taxonomies = await recipeTaxonomyModel.getByRecipeId(recipeId);

    return res.json({
      success: true,
      message: "Taxonomy removed from recipe",
      data: taxonomies,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addTaxonomy,
  getTaxonomies,
  removeTaxonomy,
};
