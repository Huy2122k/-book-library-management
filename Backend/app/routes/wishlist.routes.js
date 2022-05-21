const { authJwt } = require("../middleware");
module.exports = (app) => {
    const wishlistController = require("../controllers/wishlist-controller");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", [authJwt.verifyToken], wishlistController.create);

    // Retrieve all wishlistController
    router.get("/:id", wishlistController.findAllByUser);
    // Retrieve top author

    // Delete a book in wishlist with id
    router.delete("/:id", [authJwt.verifyToken], wishlistController.delete);

    app.use("/api/wishlist", router);
};