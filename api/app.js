const express = require("express");
const connection = require("./db");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "recetarium-api",
  });
});

// Luego borrar /test
app.get("/test", async (req, res) => {
  const query = `
  SELECT id, author_user_id, title, description
  FROM recipe
  `;

  try {
    const [results] = await connection.query(query);
    res.json({ success: true, results });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
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
