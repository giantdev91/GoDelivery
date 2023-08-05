const Order = require("../models/order");
const Notification = require("../models/notification");
const Delivery_man = require("../models/delivery_man");
const { Sequelize, sequelize } = require("../database/connection");
const { Op } = require("sequelize");
const Client = require("../models/client");
const notificationController = require("../common/notification");
const filterFunction = require("../common/filterWithGeoLocation");
const {
  NOTIFICATION_TYPE_ORDER_CREATED,
  NOTIFICATION_TYPE_ORDER_ASSIGNED,
  NOTIFICATION_TYPE_ORDER_CANCEL,
  NOTIFICATION_TYPE_ORDER_CANCEL_BY_DELIVERYMAN,
  NOTIFICATION_TYPE_ORDER_PROCESSING,
  NOTIFICATION_TYPE_ORDER_COMPLETED,
  NOTIFICATION_TYPE_ORDER_FEEDBACK,
  NOTIFICATION_TYPE_ORDER_CANNOT_CREATE,
} = require('../common/constant');

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

    const client = await Client.findOne({ where: { id: sender } });
    const clientFcmToken = client.fcmToken;
    //get all delivery man list with idle status
    const deliveryMans = await Delivery_man.findAll({
      where: { status: 0 }
    });
    var order = {};
    if (deliveryMans.length == 0) {
      //if there is no delivery man, send notification to the sender 'We are sorry, but there is no delivery man for now. Please try again a little later.'
      notificationController.sendNotification([clientFcmToken], 'GoDelivery', 'We are sorry, but there is no delivery man for now. Please try again a little later.', null, [sender], NOTIFICATION_TYPE_ORDER_CANNOT_CREATE);
    } else {
      // create order
      order = await Order.create({
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
        orderNo: new Date().valueOf().toString()
      });
      //filter by specific radius
      const filteredDeliveryMans = filterFunction.filterPeopleByRadius(deliveryMans, { specialLat: order.fromX, specialLon: order.fromY });
      var fcmTokens = [];
      var deliverymanIds = [];
      if (filteredDeliveryMans.length == 0) {
        //if the filtered list is zero, broadcast notification to the all delivery mans
        fcmTokens = deliveryMans.map((person) => person.fcmToken);
        deliverymanIds = deliveryMans.map((person) => person.id);
      } else {
        fcmTokens = filteredDeliveryMans.map((person) => person.fcmToken);
        deliverymanIds = filteredDeliveryMans.map((person) => person.id);
      }
      //broadcast new order created notification to the all available delivery mans
      notificationController.sendNotification(fcmTokens, 'GoDelivery', 'New order created! Please accept it', order.id, deliverymanIds, NOTIFICATION_TYPE_ORDER_CREATED);
    }
    res.status(200).send({
      success: true,
      code: 200,
      message: "create success",
      data: order,
    });
  } catch (error) {
    console.log('error: ', error);
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

exports.send = async (req, res) => {
  try {
    const { orderID } = req.body;
    const order = await Order.findOne({
      where: {
        id: orderID,
      },
    });
    if (order) {
      //update order status to processing
      await Order.update(
        { status: 2 }, //processing
        {
          where: {
            id: order.id,
          },
        }
      );

      //get client info
      const client = await Client.findOne({
        where: { id: order.sender },
      });
      // get receiver info
      const receiver = await Client.findOne({
        where: { phone: order.receiver },
      })
      //if the receiver is registered to our system, send notifiction.
      if (receiver) {
        //send notification to receiver
        notificationController.sendNotification([receiver.fcmToken], 'GoDelivery', `User ${client.phone} is sending goods to you. Our system supporter will deliver it soon.`, order.id, [receiver.id], NOTIFICATION_TYPE_ORDER_PROCESSING);
      }
      res.status(200).send({
        status: true,
        code: 200,
        message: "Status update success",
      });
    } else {
      res.status(400).send({
        status: false,
        code: 400,
        message: "Order not found",
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

exports.cancel = async (req, res) => {
  try {
    const { orderID, cancelReason, by, deliverymanID } = req.body;
    const order = await Order.findOne({
      where: {
        id: orderID,
      },
      include: [
        {
          model: Delivery_man,
          as: 'delivery_man',
          attributes: ['id', 'name', 'phone', 'fcmToken'], // Specify the attributes you want to retrieve from the delivery man
        },
        {
          model: Client,
          as: "client",
          attributes: ['id', 'name', 'phone', 'fcmToken']
        },
      ],
    });
    if (order) {
      // change order status to canceled.
      await Order.update(
        { cancelReason: cancelReason, canceledBy: by, status: 4 },
        {
          where: {
            id: orderID,
          },
        }
      );
      // change delivery man status to idle
      await Delivery_man.update(
        { status: 0 },
        {
          where: {
            id: deliverymanID,
          },
        }
      );

      if (by == 0) {
        // send notification to delivery man
        notificationController.sendNotification([order.delivery_man.fcmToken], 'GoDelivery', `The order is canceled by the client. Please await until the next order.`, order.id, [deliverymanID], NOTIFICATION_TYPE_ORDER_CANCEL);
      } else {
        // send notification to sender
        notificationController.sendNotification([order.client.fcmToken], 'GoDelivery', `The order is canceled by the deliveryman.`, order.id, [order.sender], NOTIFICATION_TYPE_ORDER_CANCEL_BY_DELIVERYMAN);
      }


      res.status(200).send({
        status: true,
        code: 200,
        message: "Order cancel success",
      });
    } else {
      res.status(400).send({
        status: false,
        code: 400,
        message: "Order not found",
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

exports.receive = async (req, res) => {
  try {
    const { orderID } = req.body;
    const order = await Order.findOne({
      where: {
        id: orderID,
      },
    });
    if (order) {
      //update order status to complete
      await Order.update(
        { status: 3 },
        {
          where: {
            id: orderID,
          },
        }
      );
      //update delivery man status to idle
      await Delivery_man.update(
        { status: 0 },
        {
          where: {
            id: order.deliverymanID,
          },
        }
      );
      //get sender detail
      const sender = await Client.findOne({
        where: {
          id: order.sender
        }
      })
      //send notification to sender
      notificationController.sendNotification([sender.fcmToken], 'GoDelivery', `Your order is successfully completed. Our system expects your good feedback.`, order.id, [sender.id], NOTIFICATION_TYPE_ORDER_COMPLETED);

      res.status(200).send({
        status: true,
        code: 200,
        message: "Order cancel success",
      });
    } else {
      res.status(400).send({
        status: false,
        code: 400,
        message: "Order not found",
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

exports.rate = async (req, res) => {
  try {
    const { orderID, rate, feedbackTitle, feedbackContent } = req.body;
    const order = Order.findOne({
      where: {
        id: orderID,
      },
      include: [
        {
          model: Delivery_man,
          as: 'delivery_man',
          attributes: ['id', 'name', 'phone', 'fcmToken'], // Specify the attributes you want to retrieve from the delivery man
        },
        {
          model: Client,
          as: "client",
          attributes: ['id', 'name', 'phone', 'fcmToken']
        },
      ],
    });
    if (order) {
      await Order.update(
        { rate: rate, feedbackTitle: feedbackTitle, feedbackContent: feedbackContent },
        {
          where: {
            id: orderID,
          },
        }
      );

      //send notification to deliveryman
      notificationController.sendNotification([order.delivery_man.fcmToken], 'GoDelivery', `Customer ${order.client.name} left feedback for you. You can check it on your screen.`, order.id, [order.delivery_man], NOTIFICATION_TYPE_ORDER_FEEDBACK);

      res.status(200).send({
        status: true,
        code: 200,
        message: "rate success",
      });
    } else {
      res.status(400).send({
        status: false,
        code: 400,
        message: "Order not found",
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

exports.acceptRequest = async (req, res) => {
  try {
    const { orderID, deliverymanID } = req.body;
    const order = await Order.findOne({
      where: {
        id: orderID,
      },
      include: [
        {
          model: Client,
          as: "client",
          attributes: ['id', 'name', 'phone', 'fcmToken']
        },
      ],
    });
    const deliveryman = await Delivery_man.findOne({
      where: {
        id: deliverymanID,
      },
    });
    console.log("order ===> ", order);
    if (order) {
      if (order.status != 0) {
        res.status(200).send({
          status: false,
          code: 200,
          message: "This order is already assigned to the other delivery man.",
          data: order,
        });
      } else {
        if (deliveryman.status != 0) {
          res.status(200).send({
            status: false,
            code: 200,
            message: "You can't accept this order now because you are already assigned to the other order.",
            data: order,
          });
        } else {
          const updateorder = await Order.update(
            { status: 1, deliverymanID: deliverymanID },
            {
              where: {
                id: orderID,
              },
            }
          );
          await Delivery_man.update(
            { status: 1 },
            {
              where: {
                id: deliverymanID,
              },
            }
          )
          //if there is no delivery man, send notification to the sender 'We are sorry, but there is no delivery man for now. Please try again a little later.'
          notificationController.sendNotification([order.client.fcmToken], 'GoDelivery', 'Your order is accepted. Our system supporter will help you soon.', order.id, [order.client.id], NOTIFICATION_TYPE_ORDER_ASSIGNED);
          res.status(200).send({
            status: true,
            code: 200,
            message: "Your request is accepted. Please complete this order.",
            data: order,
          });
        }
      }
    } else {
      res.status(400).send({
        status: false,
        code: 400,
        message: "Order not found",
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

exports.totalCount = async (req, res) => {
  try {
    const { status } = req.body;
    const { count, row } = await Order.findAndCountAll({
      where: {
        status: status,
      },
    });
    res.status(200).send({
      status: true,
      code: 200,
      message: "totalcount",
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

exports.totalEarning = async (req, res) => {
  try {
    const { deliverymanID } = req.body;
    const totalprice = await Order.sum("price", {
      where: {
        deliverymanID: deliverymanID,
      },
    });
    res.status(200).send({
      status: true,
      code: 200,
      message: "Get totalprice success",
      data: totalprice,
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
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
      status: true,
      code: 200,
      message: "Get daily count success",
      data: orderCounts,
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
    const { sender, receiver, deliverymanID, status, startDate, endDate } = req.body;

    // Build the where condition based on the provided criteria
    const whereCondition = {};
    if (sender !== undefined) {
      whereCondition.sender = sender;
    }
    if (receiver !== undefined) {
      whereCondition.receiver = receiver;
    }
    if (deliverymanID !== undefined) {
      whereCondition.deliverymanID = deliverymanID;
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
      include: [
        {
          model: Client,
          as: "client",
        },
      ],
    });
    res.status(200).send({
      status: true,
      code: 200,
      message: "orderlist success",
      data: orders,
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  } finally {
    // Close the database connection when done
  }
};

exports.inProgressList = async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    // Build the where condition based on the provided criteria
    const whereCondition = {
      [Op.and]: [
        {
          status: {
            [Op.lt]: 3
          }
        },
        {
          [Op.or]: [
            { sender: sender },
            { receiver: receiver }
          ]
        }
      ]
    };
    // Find orders that match the provided criteria
    const orders = await Order.findAll({
      where: whereCondition,
      include: [
        {
          model: Delivery_man,
          as: 'delivery_man',
          attributes: ['id', 'name', 'phone'], // Specify the attributes you want to retrieve from the delivery man
        },
      ],
    });
    res.status(200).send({
      status: true,
      code: 200,
      message: "orderlist success",
      data: orders,
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  } finally {
    // Close the database connection when done
  }
};

exports.createdOrderList = async (req, res) => {
  try {
    const { deliverymanID } = req.body;

    const orders = await Order.findAll({
      where: {
        status: 0,
      },
      include: [
        {
          model: Client,
          as: "client",
        },
        {
          model: Notification,
          as: 'notifications',
          where: {
            receiver: deliverymanID,
            type: NOTIFICATION_TYPE_ORDER_CREATED,
          },
          required: false, // LEFT JOIN
        },
      ],
    });

    res.status(200).send({
      status: true,
      code: 200,
      message: "orderlist success",
      data: orders,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  } finally {
    // Close the database connection when done
  }
};

exports.processingDetailByDeliveryman = async (req, res) => {
  try {
    const { deliverymanID } = req.body;

    const orders = await Order.findOne({
      where: {
        [Op.and]: [
          { deliverymanID: deliverymanID },
          {
            [Op.or]: [
              { status: 1 },
              { status: 2 },
            ]
          }
        ]
      },
      include: [
        {
          model: Delivery_man,
          as: 'delivery_man',
          attributes: ['id', 'name', 'phone', 'fcmToken'], // Specify the attributes you want to retrieve from the delivery man
        },
        {
          model: Client,
          as: "client",
          attributes: ['id', 'name', 'phone', 'fcmToken']
        },
      ],
    });

    res.status(200).send({
      status: true,
      code: 200,
      message: "orderlist success",
      data: orders,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  } finally {
    // Close the database connection when done
  }
};
