//client.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Sys_log = sequelize.define("sys_log", {
  level: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  logType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  logContent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Sys_log;
