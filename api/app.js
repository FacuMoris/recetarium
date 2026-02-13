const express = require("express");
const app = express();
const corsMiddleware = require("./src/config/cors.js");

const recipeRoutes = require("./src/routes/recipeRoutes");

app.use(corsMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", recipeRoutes);

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
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: "Internal Server Error",
  });
});

module.exports = app;
