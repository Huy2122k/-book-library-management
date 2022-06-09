const uploadCloud = require("../config/cloudinary.config");
const { authJwt } = require("../middleware");
const controller = require("../controllers/admin.book.controller");
const lendingController = require("../controllers/lending.controller")

module.exports = function(app) {
    // Update book info
    app.put("/api/books/:id", controller.updateInfo);
    // Add new book and bookitems (new book not exist in book table)
    app.post("/api/books/", [authJwt.verifyToken, authJwt.isAdmin], controller.addNewBook);
    // Add book items (if book exist in book table)
    app.post("/api/books/items/:bookid", [authJwt.verifyToken, authJwt.isAdmin], controller.addBookItems);
    // Upload Book Cover Image
    app.post("/api/books/images", [authJwt.verifyToken, authJwt.isAdmin], uploadCloud.bookImg.single("bookImg"), controller.uploadBookImage);
    // Confirm Lending
    app.post("/api/admin/lending/:id",[authJwt.verifyToken, authJwt.isAdmin], lendingController.confirmLending) 
};