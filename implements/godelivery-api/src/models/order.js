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
    type: DataTypes.STRING,
    allowNull: true,
  },
  receiverName: {
    type: DataTypes.STRING,
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
    type: DataTypes.STRING,
    allowNull: true,
  },
  fromY: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  toX: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  toY: {
    type: DataTypes.STRING,
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
    type: DataTypes.STRING,
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
  feedbackTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feedbackContent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  distance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  pickupTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dropoffTime: {
    type: DataTypes.DATE,
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
