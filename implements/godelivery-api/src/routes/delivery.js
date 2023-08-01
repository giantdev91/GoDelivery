const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");
// const checkEmail = require('../middlewares/checkEmail');
const {
  signup: signupValidator,
  signin: signinValidator,
} = require("../validators/auth");
const { verifyToken } = require("../utils/token");

const deliveryController = require("../controllers/delivery.controller");

router.route("/signup").post(asyncHandler(deliveryController.signup));
router.route("/signin").post(asyncHandler(deliveryController.signin));

router.route("/totalcount").get(asyncHandler(deliveryController.totalcount));

router.route("/orderlist").post(asyncHandler(deliveryController.orderList));
router.route("/delete").post(asyncHandler(deliveryController.deleteClient));
router.route("/updateFcmToken").post(asyncHandler(deliveryController.updateFcmToken));
router.route("/updatestate").post(asyncHandler(deliveryController.updateState));
router
  .route("/deliverymanlist")
  .post(asyncHandler(deliveryController.deliverymanList));
router.route("/updateLocation").post(asyncHandler(deliveryController.updateLocation));

module.exports = router;
