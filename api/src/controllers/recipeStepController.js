const recipeModel = require("../models/recipeModel");
const recipeStepModel = require("../models/recipeStepModel");

async function createStep(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const { instruction } = req.body;

    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!instruction) {
      return res.status(400).json({
        success: false,
        message: "Instruction is required",
      });
    }

    const stepId = await recipeStepModel.create({
      recipeId,
      instruction,
    });

    const steps = await recipeStepModel.getByRecipeId(recipeId);

    return res.status(201).json({
      success: true,
      message: "Step created",
      transaction_id: stepId,
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
    const { instruction } = req.body;

    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!instruction) {
      return res.status(400).json({
        success: false,
        message: "Instruction is required",
      });
    }

    const step = await recipeStepModel.getById(stepId);

    if (!step || step.recipe_id != recipeId) {
      return res.status(404).json({
        success: false,
        message: "Step not found",
      });
    }

    await recipeStepModel.updateById(stepId, { instruction });

    const steps = await recipeStepModel.getByRecipeId(recipeId);

    return res.json({
      success: true,
      message: "Step Updated",
      data: steps,
    });
  } catch (err) {
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

    const step = await recipeStepModel.getById(stepId);

    if (!step || step.recipe_id != recipeId) {
      return res.status(404).json({
        success: false,
        message: "Step not found",
      });
    }

    await recipeStepModel.deleteById(stepId);
    await recipeStepModel.normalizeStepNumbers(recipeId);
    const steps = await recipeStepModel.getByRecipeId(recipeId);

    return res.json({
      success: true,
      message: "Step deleted",
      data: steps,
    });
  } catch (err) {
    next(err);
  }
}

async function updateOrder(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const stepsOrder = req.body;

    const recipe = await recipeModel.findByIdAndUser(recipeId, req.user.id);

    if (!recipe) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!Array.isArray(stepsOrder) || stepsOrder.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No steps to order",
      });
    }

    const currentSteps = await recipeStepModel.getByRecipeId(recipeId);

    if (stepsOrder.length !== currentSteps.length) {
      return res.status(400).json({
        success: false,
        message: "You must send all recipe steps",
      });
    }

    const currentIds = currentSteps.map((step) => Number(step.id));
    const requestIds = stepsOrder.map((step) => Number(step.id));

    const allStepsBelongToRecipe = requestIds.every((id) =>
      currentIds.includes(id),
    );

    if (!allStepsBelongToRecipe) {
      return res.status(400).json({
        success: false,
        message: "Steps must belong to recipe",
      });
    }

    const stepNumbers = stepsOrder.map((step) => Number(step.step_number));

    const hasInvalidNumbers = stepNumbers.some((n) => isNaN(n));

    if (hasInvalidNumbers) {
      return res.status(400).json({
        success: false,
        message: "Invalid step_number value",
      });
    }

    const expectedStepNumbers = Array.from(
      { length: stepsOrder.length },
      (_, index) => index + 1,
    );

    const hasValidNumbers =
      stepNumbers.length === expectedStepNumbers.length &&
      expectedStepNumbers.every((number) => stepNumbers.includes(number));

    if (!hasValidNumbers) {
      return res.status(400).json({
        success: false,
        message: "Step numbers must be consecutive and starting from 1",
      });
    }

    stepsOrder.sort((a, b) => Number(a.step_number) - Number(b.step_number));

    await recipeStepModel.updateStepNumbersTemporarily(recipeId);

    for (const step of stepsOrder) {
      await recipeStepModel.updateStepNumberByRecipe(
        step.id,
        recipeId,
        Number(step.step_number),
      );
    }

    const updatedSteps = await recipeStepModel.getByRecipeId(recipeId);

    return res.json({
      success: true,
      message: "Steps order updated",
      data: updatedSteps,
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
  updateOrder,
};
