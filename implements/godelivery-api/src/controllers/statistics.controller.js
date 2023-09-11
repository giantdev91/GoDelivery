const Order = require("../models/order");
const Delivery_man = require("../models/delivery_man");
const Client = require("../models/client");
const Motor = require("../models/motor");
const { Op } = require("sequelize");
const Sequelize = require("../database/connection");

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

exports.annualRevenue = async (req, res) => {
    try {
        const { year } = req.body;

        const results = await Order.findAll({
            attributes: [
                [Sequelize.fn("SUM", Sequelize.col("price")), "priceSum"],
            ],
            where: {
                status: 3,
                createdAt: {
                    [Op.between]: [
                        new Date(`${year}-01-01`), // Start date for 2023
                        new Date(`${year}-12-31`), // End date for 2023
                    ],
                },
            },
            group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
        });

        res.status(200).send({
            success: true,
            code: 200,
            data: results,
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

exports.annualOrders = async (req, res) => {
    try {
        const { year } = req.body;

        const results = await Order.findAll({
            attributes: [
                [Sequelize.fn("COUNT", Sequelize.col("*")), "orderSum"],
            ],
            where: {
                createdAt: {
                    [Op.between]: [
                        new Date(`${year}-01-01`), // Start date for 2023
                        new Date(`${year}-12-31`), // End date for 2023
                    ],
                },
            },
            group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
        });

        res.status(200).send({
            success: true,
            code: 200,
            data: results,
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

exports.dailyOrders = async (req, res) => {
    try {
        const sqlQuery = `WITH DateList AS (
            SELECT
            CURDATE() - INTERVAL (n - 1) DAY AS date
        FROM (
            SELECT 1 AS n
            UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7
            UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13
            UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19
            UNION SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25
            UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30 UNION SELECT 31
        ) AS Numbers
        WHERE CURDATE() - INTERVAL (n - 1) DAY >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
          AND CURDATE() - INTERVAL (n - 1) DAY <= CURDATE()
        ORDER BY date
        )
        
        SELECT
            dl.date AS order_date,
            COALESCE(COUNT(o.price), 0) AS order_count
        FROM
            DateList dl
        LEFT JOIN
            orders o
        ON
            DATE(dl.date) = DATE(o.createdAt)
        GROUP BY
            dl.date
        ORDER BY
            dl.date;
        `;
        Sequelize.query(sqlQuery, { type: Sequelize.QueryTypes.SELECT })
            .then((results) => {
                res.status(200).send({
                    success: true,
                    code: 200,
                    data: results,
                });
            })
            .catch((error) => {
                console.error(error);
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

const getOrdersForToday = async (date) => {
    try {
        const today = new Date(date);
        today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

        const orders = await Order.findAll({
            where: {
                createdAt: {
                    [Op.gte]: today, // Greater than or equal to the beginning of today
                    [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Less than the beginning of the next day
                },
                [Op.or]: [
                    {
                        status: 3,
                    },
                    {
                        status: 4,
                    },
                ],
            },
            include: [
                {
                    model: Delivery_man,
                    as: "delivery_man",
                    include: [
                        {
                            model: Motor,
                            required: false,
                            as: "motor",
                        },
                    ],
                },
                {
                    model: Client,
                    as: "client",
                    attributes: ["id", "name", "phone", "fcmToken"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return orders;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

exports.dailyRevenue = async (req, res) => {
    try {
        const { date } = req.body;
        const results = await getOrdersForToday(date);
        res.status(200).send({
            success: true,
            code: 200,
            data: results,
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
