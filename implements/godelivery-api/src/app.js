const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { sequelize } = require("./database/connection");
const clientRoute = require("./routes/client");
const deliveryRoute = require("./routes/delivery");
const orderRoute = require("./routes/order");
const notificationRoute = require("./routes/notification");
const syslogRoute = require("./routes/sys_log");
const sysSettingRoute = require("./routes/sys_setting");
const motorRoute = require("./routes/motor");
const systemNotificationRoute = require("./routes/systemNotification");
const statisticsRoute = require("./routes/statistics");
const weightRoute = require("./routes/weight");
const goodsTypeRoute = require("./routes/goodsType");
const cashReasonRoute = require("./routes/cashReason");

const { httpLogStream } = require("./utils/logger");
const admin = require("firebase-admin");

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
app.use("/notification", notificationRoute);
app.use("/syslog", syslogRoute);
app.use("/sysSetting", sysSettingRoute);
app.use("/motor", motorRoute);
app.use("/systemNotification", systemNotificationRoute);
app.use("/statistics", statisticsRoute);
app.use("/weight", weightRoute);
app.use("/goodsType", goodsTypeRoute);
app.use("/cashReason", cashReasonRoute);

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
var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = app;
