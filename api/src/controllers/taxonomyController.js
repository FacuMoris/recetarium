const taxonomyModel = require("../models/taxonomyModel");

const validTypes = ["category", "diet", "cuisine", "tag", "occasion", "meal"];

function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getTaxonomies(req, res, next) {
  try {
    const { type } = req.query;

    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid taxonomy type",
      });
    }
    const taxonomies = await taxonomyModel.getAll({ type });

    return res.json({
      success: true,
      data: taxonomies,
    });
  } catch (err) {
    next(err);
  }
}

async function createTaxonomy(req, res, next) {
  try {
    const { type, name, description } = req.body;

    if (!type || !name) {
      return res.status(400).json({
        success: false,
        message: "Type and name required",
      });
    }

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid taxonomy type",
      });
    }

    const slug = createSlug(name);

    const id = await taxonomyModel.create({
      type,
      name,
      slug,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Taxonomy created",
      transaction_id: id,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteTaxonomy(req, res, next) {
  try {
    const { id } = req.params;

    const affected = await taxonomyModel.softDeleteById(id);

    if (!affected) {
      return res.status(400).json({
        success: false,
        message: "Taxonomy not found",
      });
    }

    return res.json({
      success: true,
      message: "Taxonomy deleted",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTaxonomies,
  createTaxonomy,
  deleteTaxonomy,
};
