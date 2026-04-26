const express = require("express");
const app = express();
const corsMiddleware = require("./src/config/cors.js");

const recipeRoutes = require("./src/routes/recipeRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use(corsMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", authRoutes);
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
