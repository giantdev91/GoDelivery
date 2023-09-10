const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const SystemNotification = sequelize.define("system_notification", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = SystemNotification;
