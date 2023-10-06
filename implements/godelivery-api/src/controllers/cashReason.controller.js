const CashReason = require("../models/cash_reason");

exports.get = async (req, res) => {
    try {
        const cashReasonOptions = await CashReason.findAll({
            order: [["sort", "ASC"]],
        });
        res.status(200).send({
            success: true,
            code: 200,
            message: "get all type options",
            data: cashReasonOptions,
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
            await CashReason.update(
                { type: type },
                {
                    where: {
                        id: id,
                    },
                }
            );
        } else {
            const oldData = await CashReason.findOne({
                where: {
                    type: type,
                },
            });
            if (!oldData) {
                await CashReason.create({ type: type, sort: sort });
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
