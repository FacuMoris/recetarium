const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser");
const requireRole = require("../middleware/requireRole");
const taxonomyController = require("../controllers/taxonomyController");

const router = express.Router();

router.get("/taxonomies", taxonomyController.getTaxonomies);

router.post(
  "/taxonomies",
  checkJwt,
  currentUser,
  requireRole("admin"),
  taxonomyController.createTaxonomy,
);

router.delete(
  "/taxonomies/:id",
  checkJwt,
  currentUser,
  requireRole("admin"),
  taxonomyController.deleteTaxonomy,
);

module.exports = router;
