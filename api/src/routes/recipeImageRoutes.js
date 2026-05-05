const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser");
const recipeImageController = require("../controllers/recipeImageController");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/recipes/:id/images", recipeImageController.getImages);

router.post(
  "/recipes/:id/images",
  checkJwt,
  currentUser,
  upload.array("imagenes", 5),
  recipeImageController.addImage,
);

router.put(
  "/recipes/:id/images/order",
  checkJwt,
  currentUser,
  recipeImageController.updateOrder,
);

router.delete(
  "/recipes/:id/images/:imageId",
  checkJwt,
  currentUser,
  recipeImageController.deleteImage,
);

router.put(
  "/recipes/:id/images/:imageId/cover",
  checkJwt,
  currentUser,
  recipeImageController.setCover,
);

module.exports = router;
