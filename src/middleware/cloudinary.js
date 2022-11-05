const DatauriParser = require("datauri/parser");
const path = require("path");
const { resourceLimits } = require("worker_threads");
const cloudinary = require("../config/cloudinary");

const uploader = async (req, res, next) => {
  const { body, file } = req;
  if (!file) return next();

  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalName);
  const datauri = parser.format(ext, buffer);
  const filename = `${body.prefix}_${body.user_id}`;
  const cloudinaryOpt = {
    public_id: filename,
    folder: "fluffy_web",
  };
  try {
    cloudinary.uploader.upload(datauri.content, cloudinaryOpt);
    req.file = result;
    next();
  } catch {
    res.status(err).json({
      msg: err,
      msg2: "Internal Server Errorr Middleware Cloudinary",
    });
  }
};

module.exports = uploader;
