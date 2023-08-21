const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const sysSettingController = require("../controllers/sysSetting.controller");

router.route("/get").get(asyncHandler(sysSettingController.get));

router.route("/save").post(asyncHandler(sysSettingController.save));
module.exports = router;
