const Sys_Setting = require("../models/Sys_Setting");

async function createLog(level, logType, logContent) {
    try {
        const syslog = await Sys_log.create({
            level: level,
            logType: logType,
            logContent: logContent,
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

exports.get = async (req, res) => {
    try {
        const sysSetting = await Sys_Setting.findOne();
        res.status(200).send({
            success: true,
            code: 200,
            message: "get setting success",
            data: sysSetting,
        });
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.save = async (req, res) => {
    try {
        const { id, basePrice, price } = req.body;

        if (id) {
            await Sys_Setting.update(
                { basePrice: basePrice, price: price },
                {
                    where: {
                        id: id,
                    },
                }
            );
        } else {
            await Sys_Setting.create({ basePrice: basePrice, price: price });
        }

        const sysSetting = await Sys_Setting.findOne();
        res.status(200).send({
            success: true,
            code: 200,
            message: "save success",
            data: sysSetting,
        });
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};
