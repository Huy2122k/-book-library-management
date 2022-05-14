const db = require("../models");
const Book = db.book;
const Category = db.category;
const Rating = db.rating;
const Op = db.Sequelize.Op;
const seq = db.sequelize;
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
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
    const {
        page,
        pageSize,
        search,
        ratingFilter,
        categoryFilter,
        authorFilter,
        sortName,
        sortAuthor,
        sortCategory,
        sortYear,
    } = req.query;
    const sortConfig = [
        sortName && ["BookName", sortName],
        sortAuthor && ["Author", sortAuthor],
        sortCategory && [Category, "CategoryName", sortCategory],
    ];
    console.log(categoryFilter);
    try {
        const { count, rows } = await Book.findAndCountAll({
            limit: parseInt(pageSize),
            offset: parseInt(page) - 1,
            where: {
                ...(search && {
                    [Op.or]: [{
                            BookName: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            Author: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            "$category.CategoryName$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                    ],
                }),
                ...(authorFilter && {
                    Author: {
                        [Op.in]: authorFilter,
                    },
                }),
                ...(categoryFilter && {
                    CategoryID: {
                        [Op.in]: categoryFilter,
                    },
                }),
            },
            include: [{
                model: Category,
                as: "category",
                attributes: ["CategoryName"],
                required: false,
            }, ],
            order: sortConfig.filter((val) => val),
        });
        res.send({ total: count, docs: rows });
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
            accumulator[currentValue.CategoryID] =
                currentValue.CategoryName.replaceAll("\t", "").split(" & ");
            return accumulator;
        }, {});
        res.send(obj);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving Category.",
        });
    }
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Book.findByPk(id)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error retrieving Tutorial with id=" + id,
            });
        });
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
exports.getInfo = async (req, res) => {
    const bookid = req.params.id
    // const userid = req.params.userId
    const token = req.headers["x-access-token"];
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return
            }
            req.userId = decoded.id;
        });
    }
    try {
        const info = await Book.findByPk(bookid);
        const category = await Category.findByPk(info.CategoryID);
        const avgrating = await Rating.findOne({
            where: {BookID: bookid},
            attributes: [[seq.fn('avg', seq.col('rating')), 'average']],
          });
        const userRating = req.userId?await Rating.findOne({
            where: {BookID: bookid, AccountID: req.userId},
            attributes: ['rating']
        }):null
        const countRating = await Rating.findAll({
            attributes: ['rating', [seq.fn('COUNT', seq.col('Rating')), 'count']],
            where: {BookID: bookid},
            group: ['Rating']
        })
        const totalRating = await Rating.findOne({
            where: {BookID: bookid},
            attributes: [[seq.fn('count', seq.col('rating')), 'total']],
          });
        res.send({bookInfo: info, category: category.CategoryName, avgRating: avgrating, countRating: countRating, totalRating: totalRating, userRating: userRating});
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials.",
        });
    }
}