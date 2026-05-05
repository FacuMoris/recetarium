const recipeModel = require("../models/recipeModel");
const recipeImageModel = require("../models/recipeImageModel");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../helpers/uploadToCloudinary");
const { json } = require("body-parser");

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

async function updateOrder(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const imagesOrder = req.body;

    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!Array.isArray(imagesOrder) || imagesOrder.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images to order",
      });
    }

    const currentImages = await recipeImageModel.getByRecipeId(recipeId);

    if (imagesOrder.length !== currentImages.length) {
      return res.status(400).json({
        success: false,
        message: "You must send all recipe images",
      });
    }

    const currentIds = currentImages.map((image) => Number(image.id));
    const requestIds = imagesOrder.map((image) => Number(image.id));

    const allImagesBelongToRecipe = requestIds.every((id) =>
      currentIds.includes(id),
    );

    if (!allImagesBelongToRecipe) {
      return res.status(400).json({
        success: false,
        message: "Images must belong to recipe",
      });
    }

    const positions = imagesOrder.map((image) => Number(image.position));

    const hasInvalidNumbers = positions.some((p) => isNaN(p));

    if (hasInvalidNumbers) {
      return res.status(400).json({
        success: false,
        message: "Invalid position values",
      });
    }

    const expectedPositions = Array.from(
      { length: imagesOrder.length },
      (_, index) => index + 1,
    );

    const hasValidPositions =
      positions.length === expectedPositions.length &&
      expectedPositions.every((position) => positions.includes(position));

    if (!hasValidPositions) {
      return res.status(400).json({
        success: false,
        message: "Positions must be consecutive",
      });
    }

    imagesOrder.sort((a, b) => a.position - b.position);

    await recipeImageModel.updatePositionsTemporarily(recipeId);

    for (const image of imagesOrder) {
      await recipeImageModel.updatePositionByRecipe(
        image.id,
        recipeId,
        Number(image.position),
      );
    }

    const updatedImages = await recipeImageModel.getByRecipeId(recipeId);

    return res.json({
      success: true,
      message: "Images order updated",
      data: updatedImages,
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
  updateOrder,
};
