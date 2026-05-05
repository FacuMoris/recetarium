const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const app = require("../app");
const API_PREFIX = "/api/v1";

function getRoutes(stack, prefix = "") {
  let routes = [];

  stack.forEach((layer) => {
    if (layer.route) {
      const routePath = prefix + layer.route.path;

      const methods = Object.keys(layer.route.methods)
        .map((m) => m.toUpperCase())
        .join(", ");

      const middlewares = layer.route.stack.map((m) => m.name);

      routes.push({
        path: routePath,
        methods,
        middlewares,
      });
    } else if (layer.name === "router" && layer.handle.stack) {
      routes = routes.concat(getRoutes(layer.handle.stack, prefix));
    }
  });

  return routes;
}

function printRoutes() {
  const router = app._router || app.router;

  if (!router || !router.stack) {
    throw new Error("No se pudo encontrar el stack de rutas de Express.");
  }

  const routes = getRoutes(router.stack, API_PREFIX);
  console.log("\n ROUTE LIST\n");

  routes.forEach((r) => {
    console.log(`${r.methods.padEnd(10)} ${r.path}`);
    console.log(`   middleware: ${r.middlewares.join(" → ")}`);
  });

  console.log(`\n Total routes: ${routes.length}\n`);
}

printRoutes();
