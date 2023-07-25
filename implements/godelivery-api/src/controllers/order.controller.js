const Order = require("../models/order");
const Delivery_man = require("../models/delivery_man");
const { Sequelize, sequelize } = require("../database/connection");
const { Op } = require("sequelize");

exports.create = async (req, res) => {
  try {
    const {
      sender,
      receiver,
      from,
      to,
      fromLocationReferBuilding,
      toLocationReferBuilding,
      fromX,
      fromY,
      toX,
      toY,
      expectationTime,
      goodsVolumn,
      goodsWeight,
      description,
    } = req.body;

    const order = await Order.create({
      sender: sender,
      receiver: receiver,
      from: from,
      to: to,
      fromLocationReferBuilding: fromLocationReferBuilding,
      toLocationReferBuilding: toLocationReferBuilding,
      fromX: fromX,
      fromY: fromY,
      toX: toX,
      toY: toY,
      expectationTime: expectationTime,
      goodsVolumn: goodsVolumn,
      goodsWeight: goodsWeight,
      description: description,
    });

    res.status(200).send({
      success: 1,
      code: 200,
      message: "create success",
      data: order,
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

exports.send = async (req, res) => {
  try {
    const { orderID } = req.body;
    const order = Order.findOne({
      where: {
        id: orderID,
      },
    });
    if (order) {
      await Order.update(
        { status: 3 }, //processing
        {
          where: {
            id: orderID,
          },
        }
      );
      res.status(200).send({
        status: "success",
        code: 200,
        message: "Status update success",
      });
    } else {
      res.status(400).send({
        status: "failed",
        code: 400,
        message: "Order not found",
      });
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

exports.cancel = async (req, res) => {
  try {
    const { orderID, cancelReason, by, deliverymanID } = req.body;
    const order = Order.findOne({
      where: {
        id: orderID,
      },
    });
    if (order) {
      await Order.update(
        { cancelReason: cancelReason, canceledBy: by, status: 5 },
        {
          where: {
            id: orderID,
          },
        }
      );
      if (by == 1) {
        await Delivery_man.update(
          { status: 0 },
          {
            where: {
              id: deliverymanID,
            },
          }
        );
      }
      res.status(200).send({
        status: "success",
        code: 200,
        message: "Order cancel success",
      });
    } else {
      res.status(400).send({
        status: "failed",
        code: 400,
        message: "Order not found",
      });
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

exports.receive = async (req, res) => {
  try {
    const { orderID, deliverymanID } = req.body;
    const order = Order.findOne({
      where: {
        id: orderID,
      },
    });
    if (order) {
      await Order.update(
        { status: 4 },
        {
          where: {
            id: orderID,
          },
        }
      );
      await Delivery_man.update(
        { status: 0 },
        {
          where: {
            id: deliverymanID,
          },
        }
      );
      res.status(200).send({
        status: "success",
        code: 200,
        message: "Order cancel success",
      });
    } else {
      res.status(400).send({
        status: "failed",
        code: 400,
        message: "Order not found",
      });
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

exports.rate = async (req, res) => {
  try {
    const { orderID, rate } = req.body;
    const order = Order.findOne({
      where: {
        id: orderID,
      },
    });
    if (order) {
      await Order.update(
        { rate: rate },
        {
          where: {
            id: orderID,
          },
        }
      );

      res.status(200).send({
        status: "success",
        code: 200,
        message: "rate success",
      });
    } else {
      res.status(400).send({
        status: "failed",
        code: 400,
        message: "Order not found",
      });
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { orderID, deliverymanID } = req.body;
    const order = Order.findOne({
      where: {
        id: orderID,
      },
    });
    if (order) {
      const updateorder = await Order.update(
        { status: 2, deliverymanID: deliverymanID },
        {
          where: {
            id: orderID,
          },
        }
      );
      console.log("order", order);
      res.status(200).send({
        status: "success",
        code: 200,
        message: "Accept request success",
        data: order,
      });
    } else {
      res.status(400).send({
        status: "failed",
        code: 400,
        message: "Order not found",
      });
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

exports.totalCount = async (req, res) => {
  try {
    const { status } = req.body;
    const { count, row } = await Order.findAndCountAll({
      where: {
        status: status,
      },
    });
    res.status(200).send({
      status: "success",
      code: 200,
      message: "totalcount",
      data: count,
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

exports.totalEarning = async (req, res) => {
  try {
    const { deliverymanID } = req.body;
    const totalprice = await Order.sum("price", {
      where: {
        deliverymanID: deliverymanID,
      },
    });
    res.status(200).send({
      status: "success",
      code: 200,
      message: "Get totalprice success",
      data: totalprice,
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

exports.dailyCount = async (req, res) => {
  try {
    const { inputMonth } = req.body;
    const dateStart = new Date(inputMonth);
    const dateEnd = new Date(dateStart);
    dateEnd.setMonth(dateEnd.getMonth() + 1);

    const orderCounts = await Order.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.between]: [dateStart, dateEnd],
        },
      },
      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
      raw: true,
    });

    res.status(200).send({
      status: "success",
      code: 200,
      message: "Get daily count success",
      data: orderCounts,
    });
    console.log("Order Counts by Day in the Specified Month:", orderCounts);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

exports.orderList = async (req, res) => {
  try {
    const { sender, receiver, status, startDate, endDate } = req.body;

    // Build the where condition based on the provided criteria
    const whereCondition = {};
    if (sender !== undefined) {
      whereCondition.sender = sender;
    }
    if (receiver !== undefined) {
      whereCondition.receiver = receiver;
    }
    if (status !== undefined) {
      whereCondition.status = status;
    }
    if (startDate !== undefined && endDate !== undefined) {
      whereCondition.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Find orders that match the provided criteria
    const orders = await Order.findAll({
      where: whereCondition,
    });
    res.status(200).send({
      status: "success",
      code: 200,
      message: "orderlist success",
      data: orders,
    });
    console.log("Orders matching the criteria:", orders);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // Close the database connection when done
  }
};
