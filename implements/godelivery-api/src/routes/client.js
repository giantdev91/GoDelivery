const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");
// const checkEmail = require('../middlewares/checkEmail');
const {
  signup: signupValidator,
  signin: signinValidator,
} = require("../validators/auth");
const { verifyToken } = require("../utils/token");

const clientController = require("../controllers/client.controller");

router.route("/:id").get(asyncHandler(clientController.getClientById));

router.route("/signup").post(asyncHandler(clientController.signup));

router.route("/signin").post(asyncHandler(clientController.signin));

router
  .route("/savelocation")
  .post(asyncHandler(clientController.save_location));

router.route("/searchclient").post(asyncHandler(clientController.searchClient));

router.route("/orderlist").post(asyncHandler(clientController.orderList));

router.route("/totalcount").get(asyncHandler(clientController.totalcount));

router.route("/delete").post(asyncHandler(clientController.deleteClient));

router.route("/updateclient").post(asyncHandler(clientController.updateClient));

router.route("/phonecheck").post(asyncHandler(clientController.phoneCheck));

router.route("/updateFcmToken").post(asyncHandler(clientController.updateFcmToken));

module.exports = router;
