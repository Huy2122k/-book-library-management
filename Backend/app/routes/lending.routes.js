const uploadCloud = require("../config/cloudinary.config");
const { authJwt } = require("../middleware");
const controller = require("../controllers/lending.controller");

module.exports = function(app) {
    // Create lending
    app.post("/api/account/lending/:id", controller.createLending);
};