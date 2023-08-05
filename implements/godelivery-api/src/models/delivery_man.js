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
    type: DataTypes.INTEGER,
    // allowNull: false,
    defaultValue: 0,
  },
  fcmToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  locationLatitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  locationLongitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Delivery_man;
