const Notification = require("../models/notification");
const { Sequelize, sequelize } = require("../database/connection");
const { Op } = require("sequelize");

async function createNotification(content, level, type, orderID, clientID) {
  try {
    const notification = await Notification.create({
      content: content,
      level: level,
      type: type,
      orderID: orderID,
      clientID: clientID,
    });
    console.log("asdfasdf", notification);
    return notification;
  } catch (error) {}
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
    const { clientID } = req.body;
    if (clientID !== undefined) {
      const notifications = await Notification.findAll({
        where: {
          clientID: clientID,
        },
        order: [["createdAt", "DESC"]],
      });
      res.status(200).send({
        success: true,
        code: 200,
        message: "Notification list found",
        data: notifications,
      });
    } else {
      const notifications = await Notification.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.status(200).send({
        success: false,
        code: 400,
        message: "Notification list found",
        data: notifications,
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
