const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { sequelize } = require("./database/connection");
const clientRoute = require("./routes/client");
const deliveryRoute = require("./routes/delivery");
const orderRoute = require("./routes/order");

const { httpLogStream } = require("./utils/logger");

const app = express();

async () => {
  await sequelize.sync({ force: false });
  console.log("synced");
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(morgan("combined", { stream: httpLogStream }));
app.use(cors());

app.use("/client", clientRoute);
app.use("/deliveryman", deliveryRoute);
app.use("/order", orderRoute);

app.get("/", (req, res) => {
  res.status(200).send({
    status: "success",
    data: {
      message: "API working fine",
    },
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    status: "error",
    message: err.message,
  });
  next();
});

module.exports = app;
