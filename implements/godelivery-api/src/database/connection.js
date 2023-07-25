const { Sequelize } = require("sequelize");
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = require("../utils/secrets");
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
});
initial = async () => {
  await sequelize.sync({ force: false });
  console.log("synced");
};
// Run the connection test function

initial();

module.exports = sequelize;
