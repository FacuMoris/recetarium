const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser");
const recipeStepController = require("../controllers/recipeStepController");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/recipes/:id/steps", recipeStepController.getSteps);

router.post(
  "/recipes/:id/steps",
  checkJwt,
  currentUser,
  upload.single("imagen"),
  recipeStepController.createStep,
);

router.put(
  "/recipes/:id/steps/order",
  checkJwt,
  currentUser,
  upload.single("imagen"),
  recipeStepController.updateOrder,
);

router.put(
  "/recipes/:id/steps/:stepId",
  checkJwt,
  currentUser,
  upload.single("imagen"),
  recipeStepController.updateStep,
);

router.delete(
  "/recipes/:id/steps/:stepId",
  checkJwt,
  currentUser,
  recipeStepController.deleteStep,
);

module.exports = router;
