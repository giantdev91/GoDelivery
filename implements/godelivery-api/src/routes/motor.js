const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const motorController = require("../controllers/motor.controller");

router.route("/list").post(asyncHandler(motorController.list));

router.route("/totalcount").get(asyncHandler(motorController.totalCount));

router.route("/save").post(asyncHandler(motorController.save));

router.route("/delete").post(asyncHandler(motorController.delete));

module.exports = router;
