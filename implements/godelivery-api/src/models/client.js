//client.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Client = sequelize.define("client", {
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Client;
