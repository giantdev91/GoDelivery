const Sys_log = require("../models/sys_log");

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
    const syslogs = await Sys_log.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send({
      success: true,
      code: 200,
      message: "syslog list success",
      data: syslogs,
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};
