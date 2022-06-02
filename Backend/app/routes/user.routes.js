const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const uploadCloud = require("../config/cloudinary.config");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/upload-avatar", [authJwt.verifyToken],
        uploadCloud.userImg.single("avatar"),
        controller.uploadAvatar
    );
    app.post(
        "/api/verifyIdentify", [authJwt.verifyToken],
        uploadCloud.userIdentifyImg.fields([
            { name: "front" },
            { name: "back" },
            { name: "face" },
        ]),
        controller.addIdentity
    );
    app.post(
        "/api/sendVerifyEmail", [authJwt.verifyToken],
        controller.sendVerifyEmail
    );
    app.post("/api/verifyEmail", [authJwt.verifyToken], controller.verifyEmail);

    app.get("/api/all", controller.allAccess);

    app.get("/api/user", [authJwt.verifyToken], controller.userBoard);

    app.get(
        "/api/admin", [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
    app.get("/api/account/:id", controller.getInfo);
    app.put(
        "/api/account/:id", [authJwt.verifyToken, authJwt.verifyUserParam],
        controller.updateInfo
    );
    // app.put(
    //     "/api/account/addidentity/:id", [authJwt.verifyToken, authJwt.verifyUserParam],
    //     controller.addIdentity
    // );
};