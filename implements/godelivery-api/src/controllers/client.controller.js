const Client = require("../models/client");
const Client_saved_location = require("../models/client_saved_location");
const Order = require("../models/order");
const {
    hash: hashPassword,
    compare: comparePassword,
} = require("../utils/password");
const { generate: generateToken } = require("../utils/token");
const { Op } = require("sequelize");

exports.getClientById = async (req, res) => {
    try {
        const clientId = req.query.id;
        const client = await Client.findOne({
            where: { id: clientId },
            include: [
                {
                    model: Client_saved_location,
                    as: "client_saved_location",
                },
                {
                    model: Order,
                    as: "orders",
                },
            ],
        });
        res.status(200).send({
            success: true,
            code: 200,
            message: "Get Client Detail Success",
            data: client,
        });
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.signup = async (req, res) => {
    try {
        const { name, phone, password, avatar } = req.body;
        const hashedPassword = hashPassword(password.trim());

        // await Client.sync();

        const client = await Client.create({
            phone: phone,
            name: name,
            password: hashedPassword,
            avatar: avatar,
        });

        res.status(200).send({
            success: true,
            code: 200,
            message: "signup success",
            data: client.toJSON(),
        });
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
        console.error("Error:", error);
    } finally {
    }
};

exports.signin = async (req, res) => {
    try {
        const { phone, password } = req.body;
        // Search for a record with the provided phone number
        const client = await Client.findOne({
            where: { phone: phone },
            include: [
                {
                    model: Client_saved_location,
                    as: "client_saved_location",
                },
                {
                    model: Order,
                    as: "orders",
                },
            ],
        });

        // Check if the phone number exists in the database
        if (client) {
            if (comparePassword(password.trim(), client.password)) {
                const token = generateToken(client.id);
                res.status(200).send({
                    success: true,
                    code: 200,
                    message: "Signin Success",
                    data: {
                        token,
                        client,
                    },
                });
                return;
            }
            res.status(200).send({
                success: false,
                code: 401,
                message: "Incorrect password",
            });
        } else {
            res.status(200).send({
                success: false,
                code: 401,
                message: `User with phone ${phone} was not found`,
            });
        }
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.save_location = async (req, res) => {
    try {
        const { clientId, location, referBuilding } = req.body;
        const client_saved_location = await Client_saved_location.create({
            clientId: clientId,
            location: location,
            referBuilding: referBuilding,
        });
        res.status(200).send({
            success: true,
            code: 200,
            data: {
                client_saved_location,
            },
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.searchClient = async (req, res) => {
    try {
        const { searchKey } = req.body;

        // Build the where condition based on the provided criteria
        let whereCondition = {};
        if (searchKey) {
            whereCondition = {
                [Op.or]: [
                    {
                        phone: {
                            [Op.like]: `%${searchKey}%`,
                        },
                    },
                    {
                        name: {
                            [Op.like]: `%${searchKey}%`,
                        },
                    },
                ],
            };
        }

        // Find orders that match the provided criteria
        const clients = await Client.findAll({
            where: whereCondition,
            include: [
                {
                    model: Order,
                    as: "orders",
                },
            ],
        });
        res.status(200).send({
            success: true,
            code: 200,
            message: "Clientlist success",
            data: clients,
        });
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.orderList = async (req, res) => {
    try {
        const { clientId } = req.body;
        const orders = await Order.findAll({
            where: {
                sender: clientId,
            },
        });

        res.status(200).send({
            status: "success",
            code: 200,
            data: {
                orders,
            },
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.totalcount = async (req, res) => {
    try {
        const { count, clients } = await Client.findAndCountAll({});
        res.status(200).send({
            success: true,
            code: 200,
            data: {
                totalcount: count,
            },
        });
    } catch (error) {
        console.error("error:", error);
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const { clientId } = req.body;
        const client = await Client.findOne({
            where: {
                id: clientId,
            },
        });

        if (client) {
            // If the client is found, delete it from the database
            await client.destroy();
            res.status(200).send({
                success: true,
                code: 200,
                message: "Delete success",
                data: {
                    client,
                },
            });
        } else {
            res.status(200).send({
                status: "error",
                code: 400,
                message: "User not found",
            });
        }
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const { clientId, phone, name, password, avatar } = req.body;

        const updateData = {};
        if (name !== undefined) {
            updateData.name = name;
        }
        if (phone !== undefined) {
            updateData.phone = phone;
        }
        if (password !== undefined) {
            updateData.password = hashPassword(password.trim());
        }
        if (avatar !== undefined) {
            updateData.avatar = avatar;
        }

        const client = await Client.findOne({
            where: {
                id: clientId,
            },
        });

        if (client) {
            // If the client is found, delete it from the database
            const result = await client.update(updateData);

            res.status(200).send({
                success: true,
                code: 200,
                message: "Update success",
                data: result,
            });
        } else {
            res.status(200).send({
                success: false,
                code: 400,
                message: "User not found",
            });
        }
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.phoneCheck = async (req, res) => {
    try {
        const { phone } = req.body;
        const client = await Client.findOne({
            where: {
                phone: phone,
            },
        });

        if (client) {
            res.status(200).send({
                success: false,
                code: 400,
                message: `Phone number ${phone}  already exists.`,
            });
        } else {
            res.status(200).send({
                success: true,
                code: 200,
                message: `Phone number ${phone} is available.`,
            });
        }
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.updateFcmToken = async (req, res) => {
    try {
        const { clientID, fcmToken } = req.body;
        const client = await Client.findOne({
            where: {
                id: clientID,
            },
        });

        if (client) {
            // If the client is found, update it from the database
            await Client.update(
                { fcmToken: fcmToken },
                {
                    where: { id: clientID },
                }
            );
            res.status(200).send({
                success: true,
                code: 200,
                message: "Update success",
                data: {
                    client,
                },
            });
        } else {
            res.status(200).send({
                success: false,
                code: 200,
                message: "Client not found",
            });
        }
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const hashedPassword = hashPassword(password.trim());
        const client = await Client.findOne({
            where: {
                phone: phone,
            },
        });

        if (client) {
            // If the client is found, update it from the database
            await Client.update(
                { password: hashedPassword },
                {
                    where: { id: client.id },
                }
            );
            res.status(200).send({
                success: true,
                code: 200,
                message: "Update success",
                data: client,
            });
        } else {
            res.status(200).send({
                success: false,
                code: 200,
                message: "Client not found",
            });
        }
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};
