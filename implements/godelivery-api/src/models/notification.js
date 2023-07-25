//client.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Notification = sequelize.define("notification", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  clientID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Notification;
