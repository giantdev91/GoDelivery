//client.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const Motor = require("./motor");

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
    motorID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

Delivery_man.belongsTo(Motor, {
    foreignKey: "motorID",
    as: "motor",
});

Motor.hasOne(Delivery_man, {
    foreignKey: "motorID",
    as: "delivery_man",
});

module.exports = Delivery_man;
