const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const systemNotificationController = require("../controllers/systemNotification.controller");

router.route("/save").post(asyncHandler(systemNotificationController.save));

module.exports = router;
