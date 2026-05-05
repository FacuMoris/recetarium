const unitModel = require("../models/unitModel");

async function getUnits(req, res, next) {
  try {
    const units = await unitModel.getAll();

    return res.json({
      success: true,
      data: units,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUnits,
};
