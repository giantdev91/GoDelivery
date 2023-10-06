const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const statisticsController = require("../controllers/statistics.controller");

router
    .route("/annualRevenue")
    .post(asyncHandler(statisticsController.annualRevenue));

router
    .route("/annualOrders")
    .post(asyncHandler(statisticsController.annualOrders));

router
    .route("/dailyOrders")
    .post(asyncHandler(statisticsController.dailyOrders));

router
    .route("/dailyRevenue")
    .post(asyncHandler(statisticsController.dailyRevenue));

router
    .route("/totalValueOfDeliveryman")
    .post(asyncHandler(statisticsController.totalRevenueOfDeliveryman));

router
    .route("/todayValueOfDeliveryman")
    .post(asyncHandler(statisticsController.todayValueOfDeliveryman));

router
    .route("/weekValueOfDeliveryman")
    .post(asyncHandler(statisticsController.thisWeekValueOfDeliveryman));

router
    .route("/monthValueOfDeliveryman")
    .post(asyncHandler(statisticsController.thisMonthValueOfDeliveryman));

module.exports = router;
