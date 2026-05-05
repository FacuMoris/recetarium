const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser");
const recipeStepController = require("../controllers/recipeStepController");

const router = express.Router();

router.get("/recipes/:id/steps", recipeStepController.getSteps);

router.post(
  "/recipes/:id/steps",
  checkJwt,
  currentUser,
  recipeStepController.createStep,
);

router.put(
  "/recipes/:id/steps/order",
  checkJwt,
  currentUser,
  recipeStepController.updateOrder,
);

router.put(
  "/recipes/:id/steps/:stepId",
  checkJwt,
  currentUser,
  recipeStepController.updateStep,
);

router.delete(
  "/recipes/:id/steps/:stepId",
  checkJwt,
  currentUser,
  recipeStepController.deleteStep,
);

module.exports = router;
