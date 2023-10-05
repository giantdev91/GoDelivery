const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Weight = sequelize.define("weight", {
    weight: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sort: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

module.exports = Weight;
