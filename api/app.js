const express = require("express");
const app = express();
const corsMiddleware = require("./src/config/cors.js");

const recipeRoutes = require("./src/routes/recipeRoutes");
const authRoutes = require("./src/routes/authRoutes");
const favoriteRoutes = require("./src/routes/favoriteRoutes.js");
const collectionRoutes = require("./src/routes/collectionRoutes.js");
const commentRoutes = require("./src/routes/commentRoutes.js");
const ingredientRoutes = require("./src/routes/ingredientRoutes.js");
const recipeIngredientRoutes = require("./src/routes/recipeIngredientRoutes.js");
const recipeStepRoutes = require("./src/routes/recipeStepRoutes.js");
const recipeImageRoutes = require("./src/routes/recipeImageRoutes.js");
const recipeRatingRoutes = require("./src/routes/recipeRatingRoutes.js");
const uploadRoutes = require("./src/routes/uploadRoutes.js");
const unitRoutes = require("./src/routes/unitRoutes.js");
const taxonomyRoutes = require("./src/routes/taxonomyRoutes.js");
const recipeTaxonomyRoutes = require("./src/routes/recipeTaxonomyRoutes.js");

app.use(corsMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}`, authRoutes);
app.use(`${API_PREFIX}`, recipeRoutes);
app.use(`${API_PREFIX}`, favoriteRoutes);
app.use(`${API_PREFIX}`, collectionRoutes);
app.use(`${API_PREFIX}`, commentRoutes);
app.use(`${API_PREFIX}`, ingredientRoutes);
app.use(`${API_PREFIX}`, recipeIngredientRoutes);
app.use(`${API_PREFIX}`, recipeStepRoutes);
app.use(`${API_PREFIX}`, recipeImageRoutes);
app.use(`${API_PREFIX}`, recipeRatingRoutes);
app.use(`${API_PREFIX}`, uploadRoutes);
app.use(`${API_PREFIX}`, unitRoutes);
app.use(`${API_PREFIX}`, taxonomyRoutes);
app.use(`${API_PREFIX}`, recipeTaxonomyRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "recetarium-api",
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "404 Not Found",
  });
});

app.use((err, req, res, next) => {
  console.error("ERROR GLOBAL:");
  console.error("name:", err.name);
  console.error("message:", err.message);
  console.error("status:", err.status);
  console.error("statusCode:", err.statusCode);
  console.error("code:", err.code);
  console.error("stack:", err.stack);

  res.status(err.status || err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
