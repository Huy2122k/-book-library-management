const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const { book } = require("../models");
const seq = db.sequelize;
const Book = db.book;
const BookItem = db.bookItem;
const BookCategory = db.bookCategory;

// Update book info
exports.updateInfo = async(req, res) => {
    const bookid = req.params.id;
    try {
        const beforeChange = await Book.findOne({
            where: { BookID: bookid },
            attributes: [
                "BookName",
                "Author",
                "Description",
                "CategoryID",
                "ImageURL",
                "Price",
            ],
        });
        const result = await Book.update({
            BookName: req.body.BookName,
            Author: req.body.Author,
            Description: req.body.Description,
            CategoryID: req.body.Categoryid,
            ImageURL: req.body.Imageurl,
            Price: req.body.Price,
        }, { where: { BookID: bookid } });
        if (result == 1) {
            res.send({
                message: "Update successfully.",
            });
        } else {
            if (
                JSON.stringify(req.body) === JSON.stringify(beforeChange.dataValues)
            ) {
                res.send({
                    message: `Update successfully.`,
                });
            } else {
                res.send({
                    message: `Cannot update Book with id = $ { bookid }. Maybe Book was not found or req.body is empty!`,
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials.",
        });
    }
};

// Add new book and bookitems (if new book not exist in book table)
exports.addNewBook = async (req, res) => {
    try {
        const bookCreate = await Book.create({
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
        })
        const bookItems = []
        for (let i = 0; i < req.body.NumOfItem; i++) {
            bookItems.push({
                BookID: bookCreate.BookID,
                BookItemID: uuidv4(),
                Status: 'available'
            })
        }
        const bookitemcreate = await BookItem.bulkCreate(bookItems)
        const bookCategories = []
        for (const categoryitem of req.body.CategoryIDs) { 
            bookCategories.push({
                BookID: bookCreate.BookID,
                CategoryID: categoryitem,
            })
        }
        const bookcategorycreate = await BookCategory.bulkCreate(bookCategories)
        // console.log(bookCreate)
        // console.log("----------------------------")
        // console.log(bookitemcreate)
        // console.log("----------------------------")
        // console.log(bookcategorycreate)
        res.send({
            message: "Add book successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials.",
        });
    }
};

// Add bookitems (if book already exist in book table)
exports.addBookItems = async (req, res) => {
    const bookid=req.params.bookid;
    try {
        const book = await Book.findOne({
            where: { BookID: bookid }
        })
        if (!book.BookID){
            res.status(400).send({
                message: "Cannot find book",
            });
            return;
        }
        for (let i = 0; i < req.body.NumOfItem; i++) {
            const bookitemcreate = await BookItem.create({
                BookID: bookid,
                BookItemID: uuidv4(),
                Status: 'available'
            })
        }
        res.send({
            message: "Add book successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials.",
        });
    }
};