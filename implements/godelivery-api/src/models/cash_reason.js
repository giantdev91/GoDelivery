const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const CashReason = sequelize.define("cash_reason", {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sort: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

module.exports = CashReason;
