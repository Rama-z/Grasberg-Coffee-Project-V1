const cloudinary = require("cloudinary").v2;
require("dotenv");

cloudinary.consif({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

module.exports = cloudinary;
