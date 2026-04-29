const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser");
const recipeImageController = require("../controllers/recipeImageController");

const router = express.Router();

router.post(
  "/recipes/:id/images",
  checkJwt,
  currentUser,
  recipeImageController.addImage,
);

router.get("/recipes/:id/images", recipeImageController.getImages);

router.delete(
  "/recipes/:id/images/:imageId",
  checkJwt,
  currentUser,
  recipeImageController.deleteImage,
);

module.exports = router;
