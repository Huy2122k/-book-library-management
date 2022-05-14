const { authJwt } = require("../middleware");
module.exports = (app) => {
    const wishlistController = require("../controllers/wishlist-controller");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", [authJwt.verifyToken], wishlistController.create);

    // Retrieve all wishlistController
    router.get("/", [authJwt.verifyToken], wishlistController.findAllByUser);
    // Retrieve top author

    // Delete a Tutorial with id
    router.delete("/", [authJwt.verifyToken], wishlistController.delete);

    app.use("/api/wishlist", router);
};