const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.get("/recipes/:id/comments", commentController.getCommentsByRecipe);

router.post(
  "/recipes/:id/comments",
  checkJwt,
  currentUser,
  commentController.createComment,
);

router.delete(
  "/comments/:id",
  checkJwt,
  currentUser,
  commentController.deleteComment,
);

module.exports = router;
