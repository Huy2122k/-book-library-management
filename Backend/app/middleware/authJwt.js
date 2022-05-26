const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!",
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    });
};

const isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "ADMIN") {
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Require Admin Role!",
            });
            return;
        });
    });
};

const verifyUserParam = (req, res, next) => {
    let id = req.params.id;

    if (id!=req.userId) {
        return res.status(403).send({
            message: "No permission!",
        });
    }
    next();
};

const authJwt = {
    verifyUserParam: verifyUserParam,
    verifyToken: verifyToken,
    isAdmin: isAdmin,
};
module.exports = authJwt;