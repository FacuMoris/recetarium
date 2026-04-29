const recipeModel = require("../models/recipeModel");
const recipeStepModel = require("../models/recipeStepModel");
const { get } = require("../routes/recipeRoutes");

async function createStep(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const { step_number, instruction } = req.body;

    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const stepId = await recipeStepModel.create({
      recipeId,
      stepNumber: step_number,
      instruction,
    });

    return res.status(201).json({
      success: true,
      message: "Step´created",
      transaction_id: stepId,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Step number already exists for this recipe",
      });
    }

    next(err);
  }
}

async function getSteps(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const steps = await recipeStepModel.getByRecipeId(recipeId);

    return res.json({
      success: true,
      data: steps,
    });
  } catch (err) {
    next(err);
  }
}

async function updateStep(req, res, next) {
  try {
    const { id: recipeId, stepId } = req.params;
    const { step_number, instruction } = req.body;
    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!step_number && !instruction) {
      return res.status(400).json({
        success: false,
        message: "Info required to udate",
      });
    }

    const affected = await recipeStepModel.updateById(stepId, {
      stepNumber: step_number,
      instruction,
    });

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Step not found",
      });
    }

    const steps = await recipeStepModel.getByRecipeId(recipeId);

    return res.json({
      success: true,
      message: "Step Updated",
      data: steps,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Step number already exists for this recipe",
      });
    }

    next(err);
  }
}

async function deleteStep(req, res, next) {
  try {
    const { id: recipeId, stepId } = req.params;
    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const affected = await recipeStepModel.deleteById(stepId);

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Step not found",
      });
    }

    return res.json({
      success: true,
      message: "Step deleted",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createStep,
  getSteps,
  updateStep,
  deleteStep,
};
