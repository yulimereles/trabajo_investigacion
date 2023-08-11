const path = require("path");
const fs = require("fs");
const { cloudinary } = require("../services/courdinary");
const Image = require("../models/imagen.models");

//VISTAS
const indexView = (_req, res) => {
  res.render("galeria/index", { mensaje: "" });
};

const createView = (_req, res) => {
  res.render("galeria/crear");
};

//APIS
const index = async (req, res) => {
  try {
    const images = await Image.findAll();

    if (!images || images.length === 0) {
      throw {
        status: 404,
        message: "No hay imagenes registradas aún.",
      };
    }

    console.log;

    return res.json(images);
  } catch (error) {
    console.log(error);
  }
};

const show = async (req, res) => {
  const image = await Image.findOne({
    where: {
      id: req.params.id,
    },
  });

  const uploadPath = path.join(
    __dirname,
    "../files/",
    `${image.original_filename}.${image.format}`
  );

  return res.sendFile(uploadPath);
};

const store = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ mensaje: "No hay archivos que subir." });
  }

  const image = req.files.image;

  const imageExists = await Image.findOne({
    where: {
      original_filename: image.name.split(".")[0],
    },
  });
  if (imageExists) {
    return res
      .status(400)
      .json({ mensaje: "La imagen ya existe en la base de datos." });
  }

  const uploadPath = path.join(__dirname, "../files/", image.name);

  image.mv(uploadPath, function (err) {
    if (err) return res.status(500).json(err);
  });

  const {
    original_filename,
    format,
    resource_type,
    url,
    secure_url,
    asset_id,
    public_id,
    version_id,
    created_at,
  } = await cloudinary.uploader.upload(uploadPath).catch((error) => {
    console.log(error);
    res.status(500).json(error.message);
  });

  const imagen = Image.create({
    original_filename,
    format,
    resource_type,
    url,
    secure_url,
    asset_id,
    public_id,
    version_id,
    creation: created_at,
  });

  return res
    .status(201)
    .json({ success: "Imagen subida correctamente.", imagen });
};

const update = async (req, res) => {};

const destroy = async (req, res) => {
  const image = await Image.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!image) {
    return res
      .status(404)
      .json({ message: "La imagen NO existe en la base de datos." });
  }

  const uploadPath = path.join(
    __dirname,
    "../files/",
    `${image.original_filename}.${image.format}`
  );

  fs.unlink(uploadPath, function (err) {
    if (err && err.code == "ENOENT") {
      // EL archivo no existe
      return res.status(404).json({ message: "El archivo no existe." });
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      return res
        .status(500)
        .json({
          message: "Ocurrió un error al querer eliminar el archivo: " + err,
        });
    }
  });

  await cloudinary.uploader.destroy(image.public_id).catch((error) => {
    console.log(error);
    return res.status(500).json(err.message);
  });
  image.destroy();
  return res.status(200).json({ success: "Imagen eliminada correctamente." });
};

module.exports = {
  indexView,
  createView,
  index,
  show,
  update,
  store,
  destroy,
};