const db = require("../models");
const roles = require("../config/roles.config");
const Account = db.account;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    Account.findOne({
        where: {
            UserName: req.body.UserName,
        },
    }).then((user) => {
        if (user) {
            res.status(400).send({
                message: "Failed! Username is already in use!",
            });
            return;
        }
        // Email
        Account.findOne({
            where: {
                Email: req.body.Email,
            },
        }).then((user) => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Email is already in use!",
                });
                return;
            }
            next();
        });
    });
};
const checkDuplicatePhoneNumber = (req, res, next) => {
    // Username
    Account.findOne({
        where: {
            Phone: req.body.Phone,
        },
    }).then((user) => {
        if (user) {
            res.status(400).send({
                message: "Failed! Phone Number is already in use!",
            });
            return;
        }
        next();
    });
};
const checkRolesExisted = (req, res, next) => {
    if (req.body.Role) {
        if (!(req.body.Role in roles)) {
            res.status(400).send({
                message: "Failed! Role does not exist = " + req.body.Role,
            });
            return;
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted,
    checkDuplicatePhoneNumber: checkDuplicatePhoneNumber,
};

module.exports = verifySignUp;