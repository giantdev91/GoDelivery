const Motor = require("../models/motor");
const Delivery_man = require("../models/delivery_man");
const { Op } = require("sequelize");

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

exports.list = async (req, res) => {
    try {
        const { searchKey } = req.body;
        let whereCondition = {};
        if (searchKey !== undefined) {
            whereCondition = {
                [Op.or]: [
                    {
                        plate: {
                            [Op.like]: `%${searchKey}%`,
                        },
                    },
                    {
                        chassis: {
                            [Op.like]: `%${searchKey}%`,
                        },
                    },
                    {
                        brand: {
                            [Op.like]: `%${searchKey}%`,
                        },
                    },
                    {
                        model: {
                            [Op.like]: `%${searchKey}%`,
                        },
                    },
                    {
                        engine: {
                            [Op.like]: `%${searchKey}%`,
                        },
                    },
                    {
                        color: {
                            [Op.like]: `%${searchKey}%`,
                        },
                    },
                ],
            };
        }

        const motors = await Motor.findAll({
            where: whereCondition,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: Delivery_man,
                    as: "delivery_man",
                },
            ],
        });
        res.status(200).send({
            success: true,
            code: 200,
            message: "motor list",
            data: motors,
        });
    } catch (error) {
        console.log("error: ", error);
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.totalCount = async (req, res) => {
    try {
        const { count, clients } = await Motor.findAndCountAll();
        res.status(200).send({
            success: true,
            code: 200,
            data: count,
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
        const {
            id,
            plate,
            chassis,
            brand,
            model,
            engine,
            color,
            deliverymanId,
        } = req.body;
        let motorId = "";
        if (id) {
            await Motor.update(
                {
                    plate: plate,
                    chassis: chassis,
                    brand: brand,
                    model: model,
                    engine: engine,
                    color: color,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            motorId = id;
        } else {
            const motor = await Motor.create({
                plate: plate,
                chassis: chassis,
                brand: brand,
                model: model,
                engine: engine,
                color: color,
            });
            motorId = motor.id;
        }

        if (deliverymanId) {
            await Delivery_man.update(
                {
                    motorID: null,
                },
                {
                    where: { motorID: motorId },
                }
            );
            await Delivery_man.update(
                {
                    motorID: motorId,
                },
                {
                    where: { id: deliverymanId },
                }
            );
        } else {
            await Delivery_man.update(
                {
                    motorID: null,
                },
                {
                    where: { motorID: motorId },
                }
            );
        }

        res.status(200).send({
            success: true,
            code: 200,
            message: "save success",
        });
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.body;
        await Delivery_man.update(
            {
                motorID: null,
            },
            {
                where: { motorID: id },
            }
        );

        await Motor.destroy({
            where: {
                id: id,
            },
        });

        res.status(200).send({
            success: true,
            code: 200,
            message: "delete success",
        });
    } catch (error) {
        console.log("error: ", error);
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};
