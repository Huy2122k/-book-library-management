const db = require("../models");
const seq = db.sequelize;
const Account = db.account;
const Op = db.Sequelize.Op;
exports.getAllUser = async(req, res) => {
    const {
        page,
        pageSize,
        search,
        // ratingFilter,
        // categoryFilter,
        // authorFilter,
        // sortName,
        // sortAuthor,
        // sortCategory,
        // sortYear,
    } = req.query;
    try {
        console.log(req.query);
        const result = await Account.findAndCountAll({
            limit: parseInt(pageSize),
            offset: parseInt(page) - 1,
            where: {
                ...(search && {
                    [Op.or]: [{
                            UserName: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            Email: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            AccountID: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                    ],
                }),
            },
        });
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials.",
        });
    }
};

exports.toggleUserStatus = async(req, res) => {
    const accountid = req.params.id;
    console.log(accountid);
    try {
        const account = await Account.findOne({
            where: { AccountID: accountid },
        });
        console.log(account);
        const result = await Account.update({
            Status: account.Status === "available" ? "unavailable" : "available",
        }, { where: { AccountID: accountid } });
        res.send({
            message: "successfully",
            status: account.Status === "available" ? "unavailable" : "available",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while update Status.",
        });
    }
};

exports.updateIdentity = async(req, res) => {
    const accountid = req.params.id;
    try {
        const account = await Account.findOne({
            where: { AccountID: accountid },
        });
        if (!account.AccountID) {
            res.status(400).send({
                message: "Cannot find account",
            });
            return;
        }
        if (account.IdentityStatus === "confirmed") {
            res.status(200).send({
                message: "Identity has already been confirmed",
            });
            return;
        }
        if (account.IdentityStatus === "unconfirmed") {
            res.status(400).send({
                message: "Identity is not exist",
            });
            return;
        }
        if (req.body.confirmed == 0) {
            const result = await Account.update({
                IdentityStatus: "rejected",
            }, { where: { AccountID: accountid } });
            if (result == 1) {
                res.send({
                    message: "Rejected Verification!",
                });
            } else {
                res.status(500).send({
                    message: `Cannot update verify!`,
                });
            }
        } else {
            const result = await Account.update({
                IdentityStatus: "confirmed",
            }, { where: { AccountID: accountid } });
            if (result == 1) {
                res.send({
                    message: "Confirmed successfully!",
                });
            } else {
                res.status(500).send({
                    message: `Cannot update verify!`,
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while update Identity.",
        });
    }
};