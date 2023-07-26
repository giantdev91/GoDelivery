const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const syslogController = require("../controllers/syslog.controller");

router.route("/list").get(asyncHandler(syslogController.list));

module.exports = router;
