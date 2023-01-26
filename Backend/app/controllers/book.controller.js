const db = require("../models");
const Book = db.book;
const Category = db.category;
const BookCategory = db.bookCategory;
const Rating = db.rating;
const Account = db.account;
const Comment = db.comment;
const Op = db.Sequelize.Op;
const seq = db.sequelize;
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { findBookQuery } = require("./query-raw/book-raw-query");

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }

    // Create a Tutorial
    const book = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false,
    };

    // Save Tutorial in the database
    Book.create(book)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Tutorial.",
            });
        });
};

// Retrieve all Tutorials from the database.
exports.findAll = async(req, res) => {
    console.log(req.query);
    try {
        if (req.query.listId || req.query.listId === []) {
            const books = await Book.findAll({
                where: {
                    BookID: req.query.listId,
                },
            });
            res.send({ total: books.length, docs: books });
            return;
        }
        if (!req.query.page || !req.query.pageSize) {
            res.send({ total: 0, docs: [] });
            return;
        }
        const queryRaw = findBookQuery(req);
        const [results, metadata] = await seq.query(queryRaw.query);
        const [count, meta] = await seq.query(queryRaw.countQuery);
        res.send({ total: count[0].Total, docs: results });
        // res.send({ total: count, docs: rows });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials.",
        });
    }
};
exports.findTopAuthor = async(req, res) => {
    const size = req.query.size ? req.query.size : "10";
    const query = `
        SELECT Author FROM book
        GROUP BY Author
        ORDER BY COUNT(BookID) DESC
        LIMIT ${size}
        `;
    try {
        const [results, metadata] = await seq.query(query);
        res.send(results.map((val) => val.Author).filter((val) => val));
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving Author.",
        });
    }
};
exports.findAllCategories = async(req, res) => {
    try {
        const [results, metadata] = await seq.query(`
        SELECT * FROM category `);
        const obj = results.reduce(function(accumulator, currentValue) {
            accumulator[currentValue.CategoryID] = currentValue.CategoryName;
            return accumulator;
        }, {});
        res.send(obj);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving Category.",
        });
    }
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Book.update(req.body, {
            where: { id: id },
        })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was updated successfully.",
                });
            } else {
                res.send({
                    message: `
        Cannot update Tutorial with id = $ { id }.Maybe Tutorial was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id,
            });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Book.destroy({
            where: { id: id },
        })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was deleted successfully!",
                });
            } else {
                res.send({
                    message: `
        Cannot delete Tutorial with id = $ { id }.Maybe Tutorial was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id,
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Book.destroy({
            where: {},
            truncate: false,
        })
        .then((nums) => {
            res.send({
                message: `
        $ { nums }
        Tutorials were deleted successfully!`,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all tutorials.",
            });
        });
};

// find all published Tutorial
exports.findAllPublished = (req, res) => {
    Book.findAll({ where: { published: true } })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials.",
            });
        });
};

// get book information by ID
exports.getInfo = async(req, res) => {
    const bookid = req.params.id;
    const token = req.headers["x-access-token"];
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return;
            }
            req.userId = decoded.id;
        });
    }
    try {
        const info = await Book.findByPk(bookid);
        const category = await BookCategory.findAll({
            where: {
                BookID: info.BookID,
            },
            include: [{
                model: Category,
                attributes: ["CategoryName"],
            }, ],
        });
        const userRating = req.userId ?
            await Rating.findOne({
                where: { BookID: bookid, AccountID: req.userId },
                attributes: ["rating"],
            }) :
            null;
        const ratingCountResult = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };
        const countRating = await Rating.findAll({
            attributes: ["rating", [seq.fn("COUNT", seq.col("Rating")), "count"]],
            where: { BookID: bookid },
            group: ["Rating"],
        });
        countRating.forEach((rating) => {
            if (rating.dataValues["rating"] in ratingCountResult) {
                ratingCountResult[rating.dataValues["rating"]] =
                    rating.dataValues["count"];
            }
        });

        const comment = await Comment.findAll({
            where: { BookID: bookid },
            include: [{
                    model: Rating,
                    on: {
                        col1: seq.where(
                            seq.col("comment.BookID"),
                            "=",
                            seq.col("rating.BookID")
                        ),
                        col2: seq.where(
                            seq.col("comment.AccountID"),
                            "=",
                            seq.col("rating.AccountID")
                        ),
                    },
                    attributes: ["Rating"],
                },
                {
                    model: Account,
                    on: {
                        col1: seq.where(
                            seq.col("comment.AccountID"),
                            "=",
                            seq.col("account.AccountID")
                        ),
                    },
                    attributes: ["UserName", "ImageURL"],
                },
            ],
            attributes: ["CommentID", "AccountID", "Comment", "CreateDate"],
        });
        res.status(200).send({
            bookInfo: info,
            category: category.map((val) => val.category.CategoryName),
            countRating: ratingCountResult,
            userRating: userRating,
            comment: comment,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials.",
        });
    }
};

// add rating
exports.addRating = async(req, res) => {
    const bookid = req.params.id;
    const rating = req.body.rate;
    try {
        const find = await Rating.findOne({
            where: { BookID: bookid, AccountID: req.userId },
        });
        const result = find ?
            await Rating.update({
                BookID: bookid,
                AccountID: req.userId,
                Rating: rating,
                where: { BookID: bookid, AccountID: req.userId },
            }) :
            await Rating.create({
                BookID: bookid,
                AccountID: req.userId,
                Rating: rating,
            });
        res.send({
            message: "Rate successfully.",
            rating: { rating: rating },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while add rating",
        });
    }
};
//add comment
exports.addComment = async(req, res) => {
    const bookid = req.params.id;
    const comment = req.body.comment;
    try {
        const result = await Comment.create({
            CommentID: uuidv4(),
            BookID: bookid,
            AccountID: req.userId,
            Comment: comment,
            CreateDate: new Date(),
            Status: "waiting",
        });
        res.send({
            comment: result,
            message: "Comment successfully, waiting for admin approval",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while add Comment",
        });
    }
};