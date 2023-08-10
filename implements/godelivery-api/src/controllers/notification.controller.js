const Notification = require("../models/notification");
const { Sequelize, sequelize } = require("../database/connection");
const { Op } = require("sequelize");
const Order = require("../models/order");

async function createNotification(content, level, type, orderID, clientID) {
  try {
    const notification = await Notification.create({
      content: content,
      level: level,
      type: type,
      orderID: orderID,
      clientID: clientID,
    });
    return notification;
  } catch (error) { }
}

exports.create = async (req, res) => {
  try {
    const { content, level, type, orderID, clientID } = req.body;
    const notification = await createNotification(
      content,
      level,
      type,
      orderID,
      clientID
    );
    res.status(200).send({
      success: true,
      code: 200,
      message: "Notification add success",
      data: notification,
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
    const { notificationID } = req.body;
    const notification = await Notification.findOne({
      where: {
        id: notificationID,
      },
    });

    if (notification) {
      // If the client is found, delete it from the database
      await notification.destroy();
      res.status(200).send({
        success: true,
        code: 200,
        message: "Delete success",
        data: {
          notification,
        },
      });
    } else {
      res.status(400).send({
        success: false,
        code: 400,
        message: "Notification not found",
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
exports.list = async (req, res) => {
  try {
    const { clientID, deliverymanID } = req.body;

    // Build the where condition based on the provided criteria
    const whereCondition = {};
    if (clientID !== undefined) {
      whereCondition.receiver = clientID;
      whereCondition.receiverType = 0;
    }

    if (deliverymanID !== undefined) {
      whereCondition.receiver = deliverymanID;
      whereCondition.receiverType = 1;
    }

    //Find notificatinos that match the provided criteria
    const notifications = await Notification.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Order,
          as: "orders",
        },
      ],
    })

    res.status(200).send({
      success: true,
      code: 200,
      message: "Notification list found",
      data: notifications,
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};
