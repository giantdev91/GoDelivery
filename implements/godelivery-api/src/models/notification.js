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
    type: DataTypes.STRING,
    allowNull: true,
  },
  orderID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  clientID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Notification;
