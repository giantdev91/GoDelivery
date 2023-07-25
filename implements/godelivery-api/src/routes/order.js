const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const orderController = require("../controllers/order.controller");

router.route("/create").post(asyncHandler(orderController.create));

router.route("/send").post(asyncHandler(orderController.send));

router.route("/cancel").post(asyncHandler(orderController.cancel));

router.route("/receive").post(asyncHandler(orderController.receive));

router.route("/rate").post(asyncHandler(orderController.rate));

router
  .route("/acceptrequest")
  .post(asyncHandler(orderController.acceptRequest));

router.route("/totalcount").post(asyncHandler(orderController.totalCount));

router.route("/totalearning").post(asyncHandler(orderController.totalEarning));

router.route("/dailycount").post(asyncHandler(orderController.dailyCount));

router.route("/orderlist").post(asyncHandler(orderController.orderList));

module.exports = router;
