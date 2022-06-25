const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const { book } = require("../models");
const seq = db.sequelize;
const Book = db.book;
const BookItem = db.bookItem;
const BookCategory = db.bookCategory;

const insertBookCategory = (bookid, categories, t) => {
    const bookCategories = [];
    for (const categoryitem of categories) {
        bookCategories.push({
            BookID: bookid,
            CategoryID: categoryitem,
        });
    }
    return BookCategory.bulkCreate(bookCategories, { transaction: t });
};

const insertBookItem = (bookid, numOfItem, t) => {
    const bookItems = [];
    for (let i = 0; i < numOfItem; i++) {
        bookItems.push({
            BookID: bookid,
            BookItemID: uuidv4(),
            Status: "available",
        });
    }
    return BookItem.bulkCreate(bookItems, { transaction: t });
};

// Update book info
exports.updateInfo = async(req, res) => {
    const t = await seq.transaction();
    const bookid = req.params.id;
    try {
        const infoResult = await Book.update({
            BookName: req.body.BookName,
            Author: req.body.Author,
            Series: req.body.Series,
            Chapter: req.body.Chapter,
            Description: req.body.Description,
            PublishedDate: req.body.PublishedDate,
            Publisher: req.body.Publisher,
            Price: req.body.Price,
            ImageURL: req.body.ImageURL,
        }, { where: { BookID: bookid } }, { transaction: t });
        const deleteCat = await BookCategory.destroy({
            where: { BookID: bookid },
        }, { transaction: t });
        const insertCat = await insertBookCategory(bookid, req.body.CategoryIDs, t);
        await t.commit();
        res.send({
            message: "Update successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials.",
        });
        await t.rollback();
    }
};

// Add new book and bookitems (if new book not exist in book table)
exports.addNewBook = async(req, res) => {
    const t = await seq.transaction();
    try {
        const insertBook = await Book.create({
            BookName: req.body.BookName,
            Author: req.body.Author,
            Series: req.body.Series,
            Chapter: req.body.Chapter,
            Description: req.body.Description,
            Price: req.body.Price,
            PublishedDate: req.body.PublishedDate,
            Publisher: req.body.Publisher,
            ImageURL: req.body.ImageURL,
            BookID: uuidv4(),
        }, { transaction: t });
        const insertItem = await insertBookItem(
            insertBook.BookID,
            req.body.NumOfItem,
            t
        );
        const insertCat = await insertBookCategory(
            insertBook.BookID,
            req.body.CategoryIDs,
            t
        );
        await t.commit();
        res.send({
            message: "Add book successfully.",
            bookId: insertBook.BookID,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials.",
        });
        await t.rollback();
    }
};

// Add bookitems (if book already exist in book table)
exports.addBookItems = async(req, res) => {
    const t = await seq.transaction();
    const bookid = req.params.bookid;
    try {
        const book = await Book.findOne({
            where: { BookID: bookid },
        });
        if (!book.BookID) {
            res.status(400).send({
                message: "Cannot find book",
            });
            await t.rollback();
            return;
        }
        const insertItem = await insertBookItem(bookid, req.body.NumOfItem, t);
        await t.commit();
        res.send({
            message: "Add book successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials.",
        });
        await t.rollback();
    }
};

exports.uploadBookImage = (req, res) => {
    if (!req.file) {
        res.status(400).send(new Error("Cannot uploaded book image!"));
        return;
    }
    res.send(req.file);
};