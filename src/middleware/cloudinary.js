const DatauriParser = require("datauri/parser");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const uploader = async (req, res, next) => {
  const { body, file } = req;
  if (!file) return next();
  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname).toString();
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

const uploaderTrans = async (req, res, next) => {
  const { body, file } = req;
  if (!file) return next();
  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname).toString();
  const datauri = parser.format(ext, buffer);
  const filename = `${body.product_id}_${body.payment_id}`;
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

const uploaderProfile = async (req, res, next) => {
  const { body, file } = req;
  if (!file) return next();
  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname).toString();
  const datauri = parser.format(ext, buffer);
  const filename = `${body.username.replace(" ", "_")}_${Math.random(
    Number(body.phone)
  )}`;
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

const uploaderPromo = async (req, res, next) => {
  const { body, file } = req;
  if (!file) return next();
  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname).toString();
  const datauri = parser.format(ext, buffer);
  let random = (Math.random() + 1).toString(36).substring(7);
  const filename = `${random.replace(" ", "_")}_${random}`;
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

const cloud = {
  uploader,
  uploaderTrans,
  uploaderProfile,
  uploaderPromo,
};

module.exports = cloud;
