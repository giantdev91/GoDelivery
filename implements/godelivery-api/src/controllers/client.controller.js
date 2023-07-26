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
    console.log("clientId:", clientId);
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
      status: "success",
      code: 200,
      message: "Get Client Detail Success",
      data: client,
    });
  } catch (error) { }
};

exports.signup = async (req, res) => {
  try {
    const { name, phone, password, avatar } = req.body;
    console.log("data", req.body);
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
      console.log("Phone number exists in the database.");
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
    console.log("location", client_saved_location);
    res.status(200).send({
      status: "success",
      code: 200,
      data: {
        client_saved_location,
      },
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

exports.searchClient = async (req, res) => {
  try {
    const { name, phone, startDate, endDate, pageNo, pageSize } = req.body;

    // Build the where condition based on the provided criteria
    const whereCondition = {};
    if (name !== undefined) {
      whereCondition.name = name;
    }
    if (phone !== undefined) {
      whereCondition.phone = phone;
    }
    if (startDate !== undefined && endDate !== undefined) {
      whereCondition.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Find orders that match the provided criteria
    const clients = await Client.findAll({
      where: whereCondition,
    });
    res.status(200).send({
      status: "success",
      code: 200,
      message: "Clientlist success",
      data: clients,
    });
    console.log("Orders matching the criteria:", orders);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

exports.orderList = async (req, res) => {
  try {
    const { clientId } = req.body;
    console.log("clientId: ", clientId);
    const orders = await Order.findAll({
      where: {
        sender: clientId,
      },
    });
    // console.log("order", orders);

    res.status(200).send({
      status: "success",
      code: 200,
      data: {
        orders,
      },
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

exports.totalcount = async (req, res) => {
  try {
    const { count, clients } = await Client.findAndCountAll({});

    res.status(200).send({
      status: "success",
      code: 200,
      data: {
        totalcount: count,
      },
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
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
        status: "success",
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
    console.error("Error connecting to the database:", error);
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { clientId, phone, name, password, avatar } = req.body;
    const hashedPassword = hashPassword(password);
    const updatedData = {
      phone: phone,
      name: name,
      password: hashedPassword,
      avatar: avatar,
    };
    const client = await Client.findOne({
      where: {
        id: clientId,
      },
    });

    if (client) {
      // If the client is found, delete it from the database
      const result = await client.update(updatedData);

      console.log("Client updated successfully.");
      res.status(200).send({
        status: "success",
        code: 200,
        message: "Update success",
        data: {
          result,
        },
      });
    } else {
      console.log("Client not found.");
      res.status(200).send({
        status: "error",
        code: 400,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
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
        status: "error",
        code: 400,
        message: `Phone number ${phone}  already exists.`,
      });
    } else {
      res.status(200).send({
        status: "success",
        code: 200,
        message: `Phone number ${phone} is available.`,
      });
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
