const DatauriParser = require("datauri/parser");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const uploader = async (req, res, next) => {
  const { body, file } = req;
  console.log(file);
  console.log(body);
  if (!file) return next();
  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname).toString();
  console.log(ext, buffer);
  const datauri = parser.format(ext, buffer);
  const filename = `${body.menu.replace(" ", "_")}_${body.varian_id}`;
  const cloudinaryOpt = {
    public_id: filename,
    folder: "Grasberg",
  };
  try {
    const result = await cloudinary.uploader.upload(
      datauri.content,
      cloudinaryOpt
    );
    req.file = result;
    next();
  } catch {
    res.status(err).json({
      msg: err,
      msg2: "Internal Server Error Middleware Cloudinary",
    });
  }
};

module.exports = uploader;
