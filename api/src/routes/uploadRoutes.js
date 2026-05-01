const express = require("express");
const upload = require("../middleware/upload");
const uploadToCloudinary = require("../helpers/uploadToCloudinary");
const router = express.Router();

router.post("/upload-test", upload.single("imagen"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image to send",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    res.json({
      success: true,
      message: "Image uploaded",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.log(err);

    req.status(500).json({
      success: false,
      message: "Error to upload image",
    });
  }
});

module.exports = router;
