const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const goodsTypeController = require("../controllers/goodsType.controller");

router.route("/get").get(asyncHandler(goodsTypeController.get));

router.route("/save").post(asyncHandler(goodsTypeController.save));

module.exports = router;
