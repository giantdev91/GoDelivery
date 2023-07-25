//client.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const Client = require("./client");

const Client_saved_location = sequelize.define("client_saved_location", {
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referBuilding: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Client_saved_location.belongsTo(Client, {
//   foreignKey: "clientId",
//   as: "client", // Use the same alias as defined in the hasMany association of Client
// });

Client_saved_location.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});
Client.hasMany(Client_saved_location, {
  foreignKey: "clientId",
  as: "client_saved_location",
});

module.exports = Client_saved_location;
