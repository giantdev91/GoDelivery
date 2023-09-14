const { Sequelize, sequelize } = require("../database/connection");
const { Op } = require("sequelize");
const SystemNotification = require("../models/system_notification");
const admin = require("firebase-admin");
const Client = require("../models/client");
const Delivery_man = require("../models/delivery_man");

const broadcastMessage = async (title, content) => {
    const fcmTokens = [];
    const clients = await Client.findAll({
        attributes: ["fcmToken"],
    });
    clients.map((val) => {
        if (val.fcmToken) {
            fcmTokens.push(val.fcmToken);
        }
    });
    const deliverymans = await Delivery_man.findAll({
        attributes: ["fcmToken"],
    });
    deliverymans.map((val) => {
        if (val.fcmToken) {
            fcmTokens.push(val.fcmToken);
        }
    });

    const message = {
        notification: {
            title: title,
            body: content,
        },
        tokens: fcmTokens,
    };
    admin
        .messaging()
        .sendMulticast(message)
        .then((response) => {
            console.log("Successfully sent message:", response.successCount);
        });
};

exports.save = async (req, res) => {
    try {
        const { title, content } = req.body;
        await SystemNotification.create({
            title: title,
            content: content,
        });
        broadcastMessage(title, content);
        res.status(200).send({
            success: true,
            code: 200,
            message: "Send success.",
        });
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};
