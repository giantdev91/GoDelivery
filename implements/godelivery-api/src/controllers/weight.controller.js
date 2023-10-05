const Weight = require("../models/weight");

exports.get = async (req, res) => {
    try {
        const weightOptions = await Weight.findAll({
            order: [["sort", "ASC"]],
        });
        res.status(200).send({
            success: true,
            code: 200,
            message: "get all weight options",
            data: weightOptions,
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
        const { id, weight, sort } = req.body;

        if (id) {
            await Weight.update(
                { weight: weight, sort: sort },
                {
                    where: {
                        id: id,
                    },
                }
            );
        } else {
            const oldData = await Weight.findOne({
                where: {
                    weight: weight,
                },
            });
            if (!oldData) {
                await Weight.create({ weight: weight, sort: sort });
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
