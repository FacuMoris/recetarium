const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./db");

const app = express();
const port = 8888;

app.listen(port, () => {
  console.log("API running on: http://localhost:" + port);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/test", async (req, res) => {
  const query = `
  SELECT id, author_user_id, title, description
  FROM recipe
  `;

  try {
    [results] = await connection.query(query);
    res.json({ success: true, results });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
});

app.use((req, res, next) => {
  res.status(404);
  res.send(`
        <h1>404 Not Found</h1>
        `);
});
