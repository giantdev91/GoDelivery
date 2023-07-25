//client.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Delivery_man = sequelize.define("delivery_man", {
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
  status: {
    type: DataTypes.BOOLEAN,
    // allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Delivery_man;
