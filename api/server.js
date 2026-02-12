const app = require("./app");
const port = process.env.PORT || 8888;

app.listen(port, () => {
  console.log("API running on: http://" + process.env.DB_HOST + ":" + port);
});
