//client.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const Order = require("./order");

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

Notification.belongsTo(Order, {
  foreignKey: "orderID",
  as: "orders"
});
Order.hasMany(Notification, {
  foreignKey: "orderID",
  as: "notifications"
})

module.exports = Notification;
