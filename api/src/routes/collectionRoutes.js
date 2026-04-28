const express = require("express");
const checkJwt = require("../middleware/auth");
const currentUser = require("../middleware/currentUser");
const collectionController = require("../controllers/collectionControler");

const router = express.Router();

router.get(
  "/me/collections",
  checkJwt,
  currentUser,
  collectionController.getMyCollections,
);

router.post(
  "/collections",
  checkJwt,
  currentUser,
  collectionController.createCollection,
);

router.put(
  "/collections/:id",
  checkJwt,
  currentUser,
  collectionController.updateCollection,
);

router.delete(
  "/collections/:id",
  checkJwt,
  currentUser,
  collectionController.deleteCollection,
);

module.exports = router;
