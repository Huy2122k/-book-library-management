const { authJwt } = require("../middleware");
const controller = require("../controllers/admin.user.controller");
module.exports = function(app) {
    app.put(
        "/api/admin/user-identity/:id", [authJwt.verifyToken, authJwt.isAdmin],
        controller.updateIdentity
    );
    app.get(
        "/api/admin/users/", [authJwt.verifyToken, authJwt.isAdmin],
        controller.getAllUser
    );
    app.put(
        "/api/admin/user-status/:id", [authJwt.verifyToken, authJwt.isAdmin],
        controller.toggleUserStatus
    );
};