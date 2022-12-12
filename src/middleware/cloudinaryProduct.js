const DatauriParser = require("datauri/parser");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const uploaderProfile = async (req, res, next) => {
  const id = req.userPayload.user_id;
  const { body, file } = req;
  console.log(file);
  if (!file) return next();
  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname).toString();
  const datauri = parser.format(ext, buffer);
  const fileName = `${body.prefix}_${id}`;
  const cloudinaryOpt = {
    public_id: fileName,
    folder: "Grasberg",
  };

  try {
    const result = await cloudinary.uploader.upload(
      datauri.content,
      cloudinaryOpt
    );
    console.log(result);
    req.file = result;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(err).json({ msg: "Internal Server Error" });
  }
};

module.exports = { uploaderProfile };
