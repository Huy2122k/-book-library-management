const db = require("../models");
const WishList = db.wishlist;
const Book = db.book;
const Account = db.account;
const Op = db.Sequelize.Op;
const seq = db.sequelize;
// Create and Save a new wishlist
exports.create = (req, res) => {
    // Validate request
    if (!req.userId || !req.body.BookID) {
        res.status(400).send({
            message: "Cannot add to wishlist now! Empty Book ID",
        });
        return;
    }
    // Create a wishlist

    const wishList = {
        AccountID: req.userId,
        BookID: req.body.BookID,
    };
    console.log(wishList);
    // Check wishlist
    WishList.findOne({ where: wishList })
        .then((wishListRes) => {
            if (wishListRes) {
                res.status(200).send({ message: "Wishlist added successfully!" });
                return;
            }
            // Save wishlist in the database
            WishList.create(wishList)
                .then((data) => {
                    res.status(200).send(data);
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while add book to wishlist.",
                    });
                });
        })
        .catch((error) => {
            res.status(500).send({
                message: error.message || "Some error occurred while check wishlist exists.",
            });
        });
};

exports.findAllByUser = async(req, res) => {
    try {
        const account = await Account.findOne({
            where: { AccountID: req.params.id },
        });
        const rows = await Book.findAll({
            where: {
                "$wishlists.AccountID$": req.params.id,
            },
            include: [{
                model: WishList,
                required: false,
            }, ],
            // order: sortConfig.filter((val) => val),
        });
        res.send({
            list: rows,
            verified: account.IdentityStatus === "confirmed",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving wishlist.",
        });
    }
};
// Delete a wishlist with the specified id in the request
exports.delete = (req, res) => {
    if (!req.userId || !req.params.id) {
        res.status(400).send({
            message: "Cannot modify wishlist now!",
        });
        return;
    }
    WishList.destroy({
            where: { BookID: req.params.id, AccountID: req.userId },
        })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "wishlist was deleted successfully!",
                });
            } else {
                res.send({
                    message: `
                    Cannot delete wishlist.Maybe wishlist Book was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete wishlist ",
            });
        });
};