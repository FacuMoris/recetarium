const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer, folder = "recetarium/recipes") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 1200, heigh: 800, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(buffer);
  });
};

module.exports = uploadToCloudinary;
