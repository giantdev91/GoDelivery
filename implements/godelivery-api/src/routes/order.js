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

router.route("/list").post(asyncHandler(orderController.orderList));

router.route("/inprogress").post(asyncHandler(orderController.inProgressList));

router.route("/createdOrderList").post(asyncHandler(orderController.createdOrderList));

router.route("/processingDetailByDeliveryman").post(asyncHandler(orderController.processingDetailByDeliveryman));

router.route("/getById").post(asyncHandler(orderController.getByID));

router.route("/arriveNotification").post(asyncHandler(orderController.arriveNotification));

module.exports = router;
