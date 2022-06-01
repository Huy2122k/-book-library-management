const { authJwt } = require("../middleware");

module.exports = (app) => {
    const books_controller = require("../controllers/book.controller.js");

    var router = require("express").Router();

    // Retrieve all books_controller
    router.get("/", books_controller.findAll);
    // Retrieve top author

    router.get("/top-authors", books_controller.findTopAuthor);
    router.get("/categories", books_controller.findAllCategories);
    // Retrieve all published books_controller
    router.get("/published", books_controller.findAllPublished);

    // Retrieve a single Tutorial with id
    // router.get("/:id", books_controller.findOne);
    router.get("/:id", books_controller.getInfo);

    // Delete a Tutorial with id
    router.delete("/:id", books_controller.delete);

    // Delete all books_controller
    router.delete("/", books_controller.deleteAll);

    router.post("/rating/:id", [authJwt.verifyToken], books_controller.addRating);
    router.post(
        "/comment/:id", [authJwt.verifyToken],
        books_controller.addComment
    );

    app.use("/api/books", router);
};