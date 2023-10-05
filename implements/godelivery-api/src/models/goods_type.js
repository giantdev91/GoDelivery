const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const GoodsType = sequelize.define("goods_type", {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sort: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

module.exports = GoodsType;
