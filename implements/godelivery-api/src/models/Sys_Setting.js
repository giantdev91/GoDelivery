//client.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Sys_Setting = sequelize.define("sys_settings", {
    basePrice: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
});

module.exports = Sys_Setting;
