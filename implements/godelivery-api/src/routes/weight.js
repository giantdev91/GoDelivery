const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const weightController = require("../controllers/weight.controller");

router.route("/get").get(asyncHandler(weightController.get));

router.route("/save").post(asyncHandler(weightController.save));

module.exports = router;
