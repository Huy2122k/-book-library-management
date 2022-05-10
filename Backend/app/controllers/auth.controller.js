const db = require("../models");
const config = require("../config/auth.config");
const Account = db.account;
const { v4: uuidv4 } = require("uuid");
const Op = db.Sequelize.Op;
var sendToEmail = require("../ultis/mail");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const roles = require("../config/roles.config");

exports.signup = (req, res) => {
    // Save User to Database
    Account.create({
            ...req.body,
            Password: bcrypt.hashSync(req.body.Password, 8),
            AccountID: uuidv4(),
            Status: "unconfirmed_email",
            Role: req.body.Role ? req.body.Role : roles.USER,
        })
        .then((user) => {
            const token = jwt.sign({ id: user.AccountID }, config.secret, {
                expiresIn: 86400, // 24 hours
            });
            res.status(200).send({ info: user, accessToken: token });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: "something went wrong!" });
        });
};

exports.signin = (req, res) => {
    const findQueryCondition = [
        req.body.UserName ? { UserName: req.body.UserName } : undefined,
        req.body.UserName ? { Email: req.body.UserName } : undefined,
        req.body.UserName ? { Phone: req.body.UserName } : undefined,
    ];
    Account.findOne({
            where: {
                [Op.or]: findQueryCondition,
            },
        })
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.Password,
                user.Password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!",
                });
            }
            const token = jwt.sign({ id: user.AccountID }, config.secret, {
                expiresIn: 86400, // 24 hours
            });
            res.status(200).send({ info: user, accessToken: token });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

exports.changePassword = async(req, res) => {
    const findQueryCondition = [
        req.body.UserName ? { UserName: req.body.UserName } : undefined,
        req.body.UserName ? { Email: req.body.UserName } : undefined,
        req.body.UserName ? { Phone: req.body.UserName } : undefined,
    ];
    try {
        const user = await Account.findOne({
            where: {
                [Op.or]: findQueryCondition,
            },
        });
        if (!user) {
            return res.status(200).send({ message: "User Not found." });
        }
        const passwordIsValid = bcrypt.compareSync(
            req.body.Password,
            user.Password
        );
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!",
            });
        }

        user.Password = bcrypt.hashSync(req.body.NewPassword, 8);
        await user.save();
        res.status(200).send({ message: "Your Password has been updated!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.resetPassword = async(req, res) => {
    const findQueryCondition = [
        req.body.UserName ? { UserName: req.body.UserName } : undefined,
        req.body.UserName ? { Email: req.body.UserName } : undefined,
        req.body.UserName ? { Phone: req.body.UserName } : undefined,
    ];
    try {
        const user = await Account.findOne({
            where: {
                [Op.or]: findQueryCondition,
            },
        });
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        const resetPassWord = (Math.random() + 1).toString(36).substring(2);
        await sendToEmail(
            user.Email,
            "Reset Password",
            `<h1>Welcome</h1><p>Your new password is: <b>${resetPassWord} </b> </p>`,
            async(error, info) => {
                if (!error) {
                    console.log("Email sent: " + info.response);
                    user.Password = bcrypt.hashSync(resetPassWord, 8);
                    await user.save();
                    res.status(200).send({
                        message: "Your new password has been sent to your email!",
                    });
                    return;
                } else {
                    console.log(error);
                    res.status(404).send({ message: "Can not send to your email!" });
                    return false;
                }
            }
        );
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};