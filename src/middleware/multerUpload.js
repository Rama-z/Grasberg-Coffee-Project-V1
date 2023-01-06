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
        return res.status(400).json({
          status: 400,
          msg: "File too large, image must be 2MB or lower",
        });
      } else {
        console.log(error);
        return res.status(400).json({
          status: 400,
          msg: "Check your file type. Only .jpg, .jpeg, and .png are allowed",
        });
      }
    }
    return next();
  });
};
