const commentModel = require("../models/commentModel");

async function createComment(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const { content, parent_comment_id } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    if (parent_comment_id) {
      const parentComment = await commentModel.findByIdAndRecipeId(
        parent_comment_id,
        recipeId,
      );

      if (!parentComment) {
        return res.status(400).json({
          success: false,
          message: "Parent comment does not belong to this recipe",
        });
      }
    }

    const commentId = await commentModel.create({
      recipeId,
      userId,
      content,
      parentCommentId: parent_comment_id,
    });

    return res.status(201).json({
      success: true,
      message: "Comment created",
      transaction_id: commentId,
    });
  } catch (err) {
    next(err);
  }
}

async function getCommentsByRecipe(req, res, next) {
  try {
    const { id: recipeId } = req.params;
    const comments = await commentModel.getRecipeById(recipeId);

    return res.json({
      success: true,
      data: comments,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteComment(req, res, next) {
  try {
    const { id } = req.params;

    const comment = await commentModel.findByIdAndUser(id, req.user.id);

    if (!comment) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await commentModel.softDeleteById(id);

    return res.json({
      success: true,
      message: "Comment deleted",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createComment,
  getCommentsByRecipe,
  deleteComment,
};
