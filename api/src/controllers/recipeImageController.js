const recipeModel = require("../models/recipeModel");
const recipeImageModel = require("../models/recipeImageModel");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../helpers/uploadToCloudinary");

async function addImage(req, res, next) {
  try {
    const { id: recipeId } = req.params;

    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }
    const currentImageCount = await recipeImageModel.countByRecipeId(recipeId);
    const requestImageCount = req.files.length;

    if (currentImageCount + requestImageCount > 5) {
      return res.status(400).json({
        success: false,
        message: "A recipe can have a mximum of 5 images",
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(
        file.buffer,
        "recetarium/recipes",
      );

      const imageId = await recipeImageModel.create({
        recipeId,
        url: result.secure_url,
        storageKey: result.public_id,
      });

      uploadedImages.push({
        id: imageId,
        url: result.secure_url,
        storage_key: result.public_id,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Images added",
      data: uploadedImages,
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

    const image = await recipeImageModel.getById(imageId);

    if (!image || image.recipe_id != recipeId) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    if (image.storage_key) {
      await cloudinary.uploader.destroy(image.storage_key);
    }

    const affected = await recipeImageModel.deleteById(imageId);

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    await recipeImageModel.normalizePositions(recipeId);

    return res.json({
      success: true,
      message: "Image delete",
    });
  } catch (err) {
    next(err);
  }
}

async function setCover(req, res, next) {
  try {
    const { id: recipeId, imageId } = req.params;

    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const image = await recipeImageModel.getById(imageId);

    if (!image || image.recipe_id != recipeId) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    if (image.position === 1) {
      return res.json({
        success: true,
        message: "Image is already cover",
      });
    }

    const currentCover = await recipeImageModel.getByPosition(recipeId, 1);
    await recipeImageModel.updatePosition(image.id, 1);

    if (currentCover) {
      await recipeImageModel.updatePosition(currentCover.id, image.position);
    }

    return res.json({
      success: true,
      message: "Cover updated",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getImages,
  addImage,
  deleteImage,
  setCover,
};
