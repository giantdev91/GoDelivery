const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const cashReasonController = require("../controllers/cashReason.controller");

router.route("/get").get(asyncHandler(cashReasonController.get));

router.route("/save").post(asyncHandler(cashReasonController.save));

module.exports = router;
