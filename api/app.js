const express = require("express");
const app = express();
const auth0Middleware = require("./src/config/auth0");

const recipeRoutes = require("./src/routes/recipeRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(auth0Middleware);

app.use("/api/v1", recipeRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "recetarium-api",
  });
});

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get("/hello-auth", (req, res) => {
  res.json({
    status: "ok",
    message: "login successful",
  });
});
app.get("/bye-auth", (req, res) => {
  res.json({
    status: "ok",
    message: "logout successful",
  });
});
// Luego borrar /error

app.get("/error", (req, res, next) => {
  next(new Error("Test 500"));
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "404 Not Found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

module.exports = app;
