const { authJwt } = require("../middleware");
const controller = require("../controllers/admin.user.controller");
module.exports = function(app) {
    app.put("/api/admin/checkidentity/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.checkIdentity);
};