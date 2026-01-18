const cloudinary = require("cloudinary").v2;

const imageUploader = async (file, folder, height, quality) => {
  try {
    const options = {
      folder,
      resource_type: "auto",
    };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    // 🔥 Normalize file input
    const filePath = file?.tempFilePath || file;

    if (!filePath) {
      throw new Error("Invalid file input for Cloudinary upload");
    }

    return await cloudinary.uploader.upload(filePath, options);
  } catch (err) {
    console.error("Cloudinary Upload Error:", err.message);
    throw err;
  }
};

module.exports = imageUploader;