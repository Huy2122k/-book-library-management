const db = require("../models");
const seq = db.sequelize;
const Account = db.account;

// Send Identity Card Image
exports.checkIdentity = async(req, res) => {
    const accountid = req.params.id;
    try {
        const account = await Account.findOne({
            where: { AccountID: accountid }
        })
        if (!account.AccountID){
            res.status(400).send({
                message: "Cannot find account",
            });
            return;
        }
        if (account.IdentityStatus=="confirmed"){
            res.status(400).send({
                message: "Identity has already been confirmed",
            });
            return;
        }
        if (account.IdentityStatus=="unconfirmed"){
            res.status(400).send({
                message: "Identity is not exist",
            });
            return;
        }
        if (req.body.confirmed == 0){
            const result = await Account.update({
                IdentityNum: null,
                FrontsideURL: null,
                BacksideURL: null,
                FaceURL: null,
                IdentityStatus: "unconfirmed"
            }, { where: { AccountID: accountid } });
            if (result == 1) {
                res.send({
                    message: "Unconfirmed",
                });
            } else {
                res.send({
                    message: `Cannot add Identity Images with id = $ { accountid }. Maybe Account was not found or req.body is empty!`,
                });
            }
        }
        else{
            const result = await Account.update({
                IdentityStatus: "confirmed"
            }, { where: { AccountID: accountid } });
            if (result == 1) {
                res.send({
                    message: "Confirmed.",
                });
            } else {
                res.send({
                    message: `Cannot add Identity Images with id = $ { accountid }. Maybe Account was not found or req.body is empty!`,
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials.",
        });
    }
};