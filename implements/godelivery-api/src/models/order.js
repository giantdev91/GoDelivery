//client.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const Client = require("./client");
const Delivery_man = require("./delivery_man");

const Order = sequelize.define("order", {
  sender: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  receiver: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  from: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  to: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fromLocationReferBuilding: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  toLocationReferBuilding: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fromX: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fromY: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  toX: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  toY: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  expectationTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  goodsVolumn: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  goodsWeight: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  deliverymanID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cancelReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  canceledBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  orderNo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  spentTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rate: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
});

Order.belongsTo(Client, {
  foreignKey: "sender",
  as: "client",
});
Client.hasMany(Order, {
  foreignKey: "sender",
  as: "orders",
});

Order.belongsTo(Delivery_man, {
  foreignKey: "deliverymanID",
  as: "delivery_man",
});
Delivery_man.hasMany(Order, {
  foreignKey: "deliverymanID",
  as: "orders",
});

module.exports = Order;
