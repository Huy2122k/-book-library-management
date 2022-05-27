const { authJwt } = require("../middleware");
const controller = require("../controllers/admin.book.controller");
module.exports = function(app) {
    // Update book info
    app.put("/api/books/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.updateInfo);
    // Add new book and bookitems (new book not exist in book table)
    app.post("/api/books/", controller.addNewBook);
    // Add book items (if book exist in book table)
    app.post("/api/books/items/:bookid", controller.addBookItems);
};