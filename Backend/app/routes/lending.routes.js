const uploadCloud = require("../config/cloudinary.config");
const { authJwt } = require("../middleware");
const controller = require("../controllers/lending.controller");

module.exports = function(app) {
    // Create lending
    app.post("/api/lending/", [authJwt.verifyToken], controller.createLending);
    app.get(
        "/api/lending/", [authJwt.verifyToken],
        controller.getAmountLendingByUser
    );
    app.post("/api/lending/:id", controller.confirmLending)
};