const recipeModel = require("../models/recipeModel");
const recipeImageModel = require("../models/recipeImageModel");

async function addImage(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const { url, storage_key, position } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const imageId = await recipeImageModel.create({
      recipeId,
      url,
      storageKey: storage_key,
      position,
    });

    return res.status(201).json({
      success: true,
      message: "Image added",
      transaction_id: imageId,
    });
  } catch (err) {
    next(err);
  }
}

async function getImages(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const images = await recipeImageModel.getByRecipeId(recipeId);

    return res.json({
      success: true,
      data: images,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteImage(req, res, next) {
  try {
    const { id: recipeId, imageId } = req.params;
    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const affected = await recipeImageModel.deleteById(imageId);

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    return res.json({
      success: true,
      message: "Image delete",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getImages,
  addImage,
  deleteImage,
};
