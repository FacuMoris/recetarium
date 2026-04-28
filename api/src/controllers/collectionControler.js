const collectionModel = require("../models/collectionModel");

async function createCollection(req, res, next) {
  try {
    const { name, description, visibility } = req.body;
    const ownerUserId = req.user.id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name si required",
      });
    }

    if (visibility && !["public", "private"].includes(visibility)) {
      return res.status(400).json({
        success: false,
        message: "visibility must be defined",
      });
    }

    const id = await collectionModel.create({
      ownerUserId,
      name,
      description,
      visibility,
    });
    return res.status(201).json({
      success: true,
      message: "Collection created",
      transaction_id: id,
    });
  } catch (err) {
    next(err);
  }
}

async function getMyCollections(req, res, next) {
  try {
    const collections = await collectionModel.getByUserId(req.user.id);

    return res.json({
      success: true,
      data: collections,
    });
  } catch (err) {
    next(err);
  }
}

async function updateCollection(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, visibility } = req.body;

    if (!name && !description && !visibility) {
      return res.status(400).json({
        success: false,
        message: "Info required to update",
      });
    }

    if (visibility && !["public", "private"].includes(visibility)) {
      return res.status(400).json({
        success: false,
        message: "Visibility must be defined",
      });
    }

    const collection = await collectionModel.findByIdAndUser(id, req.user.id);
    if (!collection) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await collectionModel.updateById(id, { name, description, visibility });

    const updated = await collectionModel.findByIdAndUser(id, req.user.id);

    return res.json({
      success: true,
      message: "Collection updated",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteCollection(req, res, next) {
  try {
    const { id } = req.params;

    const collection = await collectionModel.findByIdAndUser(id, req.user.id);

    if (!collection) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await collectionModel.softDeleteById(id);

    return res.json({
      success: true,
      message: "Collection deleted",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCollection,
  getMyCollections,
  updateCollection,
  deleteCollection,
};
