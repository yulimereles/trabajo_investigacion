const { DataTypes } = require("sequelize");
const { sequelize } = require("../database.js");

const Imagen = sequelize.define(
  "image",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Imagen;