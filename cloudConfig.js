const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.COULD_NAME,
  api_key: process.env.COULD_API_KEY,
  api_secret: process.env.COULD_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Syncpick",
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});
module.exports = { storage, cloudinary };