const multer = require("multer");
const path = require("path");
const response = require("../helper/response");

const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
    return cb({
      message: "Check your file type. Only .jpg, .jpeg, and .png are allowed",
    });
  }
  cb(null, true);
};

const limits = {
  fileSize: 2 * 1024 * 1024,
};

const memoryUpload = multer({
  storage: memoryStorage,
  fileFilter,
  limits,
}).single("image");

exports.memoryStorageUploadProfile = async (req, res, next) => {
  await memoryUpload(req, res, (error) => {
    // error multer
    if (error) {
      if (error.code == "LIMIT_FILE_SIZE") {
        return response(res, {
          data: null,
          status: 400,
          message: "File Size is too large. Allowed file size is 2Mb",
        });
      } else {
        console.log(error);
        return response(res, {
          data: null,
          status: 400,
          message: "General error.",
          error,
        });
      }
    }
    return next();
  });
};
