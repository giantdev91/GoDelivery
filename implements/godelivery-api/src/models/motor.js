//client.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const Delivery_man = require("./delivery_man");

const Motor = sequelize.define("motor", {
    plate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    chassis: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    engine: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Motor;
