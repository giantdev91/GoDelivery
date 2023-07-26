const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const notificationController = require("../controllers/notification.controller");

router.route("/create").post(asyncHandler(notificationController.create));

router.route("/delete").post(asyncHandler(notificationController.delete));

router.route("/list").post(asyncHandler(notificationController.list));

module.exports = router;
