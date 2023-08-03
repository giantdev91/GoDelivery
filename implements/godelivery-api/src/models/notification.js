//client.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Notification = sequelize.define("notification", {
  content: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  receiver: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverType: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Notification;
