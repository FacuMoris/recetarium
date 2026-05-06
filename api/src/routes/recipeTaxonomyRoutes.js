const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser");
const recipeTaxonomyController = require("../controllers/recipeTaxonomyController");

const router = express.Router();

router.post(
  "/recipes/:id/taxonomies",
  checkJwt,
  currentUser,
  recipeTaxonomyController.addTaxonomy,
);
router.get("/recipes/:id/taxonomies", recipeTaxonomyController.getTaxonomies);
router.delete(
  "/recipes/:id/taxonomies/:taxonomyId",
  checkJwt,
  currentUser,
  recipeTaxonomyController.removeTaxonomy,
);

module.exports = router;
