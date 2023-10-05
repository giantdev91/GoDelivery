const GoodsType = require("../models/goods_type");

exports.get = async (req, res) => {
    try {
        const goodsTypeOptions = await GoodsType.findAll({
            order: [["sort", "ASC"]],
        });
        res.status(200).send({
            success: true,
            code: 200,
            message: "get all type options",
            data: goodsTypeOptions,
        });
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};

exports.save = async (req, res) => {
    try {
        const { id, type, sort } = req.body;

        if (id) {
            await GoodsType.update(
                { type: type },
                {
                    where: {
                        id: id,
                    },
                }
            );
        } else {
            const oldData = await GoodsType.findOne({
                where: {
                    type: type,
                },
            });
            if (!oldData) {
                await GoodsType.create({ type: type, sort: sort });
            }
        }

        res.status(200).send({
            success: true,
            code: 200,
            message: "save success",
        });
    } catch (error) {
        res.status(200).send({
            success: false,
            code: 500,
            message: "Internal server error",
        });
    }
};
