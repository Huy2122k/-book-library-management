const db = require("../models");
const LendingList = db.lendingList;
const Account = db.account;
const LendingBookList = db.lendingBookList;
const BookItem = db.bookItem;
const Book = db.book;
const Op = db.Sequelize.Op;
const seq = db.sequelize;
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const sendToEmail = require("../ultis/mail");

exports.getAmountLending = async(userId) => {
    try {
        const lendingList = await LendingList.findAll({
            where: {
                AccountID: userId,
                Status: {
                    [Op.not]: "return",
                },
            },
            include: [{
                model: LendingBookList,
                include: [{
                    model: BookItem,
                    attributes: [
                        "BookItemID", [seq.fn("COUNT", "BookItemID"), "bookItemLendCount"],
                    ],
                }, ],
                attributes: ["LendingID"],
            }, ],
            attributes: [
                "LendingID",
                "CreateDate",
                "DueDate",
                "ReturnDate",
                "Status",
            ],
        });
        if (
            lendingList.length > 0 &&
            lendingList[0].dataValues.lendingbooklists.length > 0
        ) {
            return lendingList[0].dataValues.lendingbooklists["0"].dataValues.bookitem
                .dataValues.bookItemLendCount;
        }
        return 0;
    } catch (error) {
        console.log(error);
        return null;
    }
};

exports.sendReturnLateMail = async() => {
    try {
        const lendingList = await LendingList.findAll({
            where: {
                Status: "borrow",
                DueDate: {
                    [Op.lt]: new Date(),
                },
            },
            include: [{
                    model: LendingBookList,
                    attributes: ["BookItemID"],
                },
                {
                    model: Account,
                    attributes: ["AccountID", "Email"],
                },
            ],
            attributes: [
                "LendingID",
                "CreateDate",
                "DueDate",
                "ReturnDate",
                "Status",
            ],
        });
        console.log(lendingList);
        lendingList.forEach(async(lending, ind) => {
            if (lending.lendingbooklists.length >= 5) {
                console.log(lending.account.dataValues.Email);
                await sendToEmail(
                    lending.account.dataValues.Email,
                    "[WARNING] Return book due date",
                    `<h1>Please return book to library</h1><p> You are currently lending ${lending.lendingbooklists.length} books and due date ${lending.dataValues.DueDate}</p>`,
                    async(error, info) => {
                        if (!error) {
                            return;
                        } else {
                            console.log(error);
                            return;
                        }
                    }
                );
            }
        });
    } catch (error) {
        console.log(error);
        console.log({ message: "Can not send to your email!" });
    }
};

exports.getAmountLendingByUser = async(req, res) => {
    try {
        const amount = await exports.getAmountLending(req.userId);
        res.send({
            count: amount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Cannot get amount lending",
        });
    }
};

// Create Lending
exports.createLending = async(req, res) => {
    const accountid = req.userId;
    const t = await seq.transaction();
    try {
        // Check if number of borrow book + number of book in the create lending exceed the borrow book limit
        const numOfBorrowBook = await exports.getAmountLending(accountid);
        console.log(numOfBorrowBook);
        if (!numOfBorrowBook && numOfBorrowBook != 0) {
            res.status(500).send({
                message: "Cannot get amount lending",
            });
            await t.rollback();
            return;
        }
        if (req.body.BorrowBookList.length + numOfBorrowBook > 10) {
            res.status(400).send({
                message: "Borrow Book exceed the limit",
            });
            await t.rollback();
            return;
        }
        // Check if exist bookitem in book in the create lending list is available
        const availableBook = await BookItem.findAll({
            where: { BookID: req.body.BorrowBookList, Status: "available" },
            group: ["BookID"],
            attributes: ["BookID", "BookItemID"],
        });
        const availableBookList = availableBook.map((element) => element.BookID);
        const unavailableBookList = req.body.BorrowBookList.filter(
            (x) => !availableBookList.includes(x)
        );
        if (unavailableBookList.length > 0) {
            res.status(404).send({
                message: "Exist Books are not available",
                unavailableBookList,
            });
            await t.rollback();
            return;
        }
        const createLending = await LendingList.create({
            LendingID: uuidv4(),
            AccountID: accountid,
            CreateDate: moment(),
            DueDate: moment().add(6, "months"),
            ReturnDate: null,
            Status: "pending",
        }, { transaction: t });
        const bookItemList = availableBook.map((element) => element.BookItemID);
        console.log(bookItemList);
        const updateBookItem = await BookItem.update({
            Status: "unavailable",
        }, { where: { BookItemID: bookItemList } }, { transaction: t });
        const lendingBooks = [];
        for (const item of bookItemList) {
            lendingBooks.push({
                LendingID: createLending.LendingID,
                BookItemID: item,
            });
        }
        const createLendingBook = await LendingBookList.bulkCreate(lendingBooks, {
            transaction: t,
        });
        await t.commit();
        res.status(200).send({
            message: "Borrow Successfully, please wait for admin approval!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while lendingbook",
        });
        await t.rollback();
    }
};

exports.getLending = async(req, res) => {
    try {
        const lending = await LendingList.findOne({
            where: { LendingID: req.params.id },
            include: [{
                model: LendingBookList,
                include: [{
                    model: BookItem,
                    include: [{
                        model: Book,
                        attributes: [
                            "BookID",
                            "BookName",
                            "Author",
                            "Series",
                            "Chapter",
                            "PublishedDate",
                            "ImageURL",
                        ],
                    }, ],
                    attributes: ["BookItemID"],
                }, ],
                attributes: ["LendingID"],
            }, ],
            attributes: [
                "AccountID",
                "LendingID",
                "CreateDate",
                "DueDate",
                "ReturnDate",
                "Status",
            ],
        });
        res.status(200).send(lending);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred lending",
        });
    }
};
// Cancel Lending (for User)
exports.cancelLending = async(req, res) => {
    const lendingid = req.params.id;
    // Confirm User
    try {
        const lendingInfo = await LendingList.findOne({
            attributes: ["AccountID"],
            where: { LendingID: lendingid },
        });
        if (req.userId !== lendingInfo.AccountID) {
            res.status(403).send({
                message: "Unauthorized",
            });
            return;
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while lendingbook",
        });
    }
    const t = await seq.transaction();
    try {
        await LendingList.update({
            Status: "reject",
        }, { where: { LendingID: lendingid }, transaction: t });
        await BookItem.update({
            Status: "available",
        }, { where: { BookItemID: req.body.rejectBookItemIDs }, transaction: t });
        await t.commit();
        res.status(200).send({
            message: "Cancel Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while lendingbook",
        });
        await t.rollback();
    }
};

// Confirm Lending (for Admin)
exports.confirmLending = async(req, res) => {
    const lendingid = req.params.id;
    const t = await seq.transaction();
    try {
        // If there is no reject Book Item ID => accept lending list
        if (req.body.rejectBookItemIDs.length === 0) {
            await LendingList.update({
                Status: "borrow",
            }, { where: { LendingID: lendingid }, transaction: t });
        }
        // If there is no accept Book Item ID => reject lending list
        else if (req.body.acceptBookItemIDs.length === 0) {
            await LendingList.update({
                Status: "reject",
            }, { where: { LendingID: lendingid }, transaction: t });
            await BookItem.update({
                Status: "available",
            }, { where: { BookItemID: req.body.rejectBookItemIDs }, transaction: t });
        }
        // If there are A book item accepted, B book item rejected
        // Split Lending into 2 different Lending
        // One contain accepted book, and other contain rejected book
        else {
            const getLending = await LendingList.findOne({
                where: { LendingID: lendingid },
                attributes: ["AccountID", "CreateDate", "DueDate"],
            });

            const createRejectLending = await LendingList.create({
                LendingID: uuidv4(),
                AccountID: getLending.AccountID,
                CreateDate: getLending.CreateDate,
                DueDate: getLending.DueDate,
                ReturnDate: null,
                Status: "reject",
            }, { transaction: t });

            await LendingBookList.destroy({
                where: {
                    LendingID: lendingid,
                    BookItemID: req.body.rejectBookItemIDs,
                },
            }, { transaction: t });

            const rejectBooks = [];
            for (const item of req.body.rejectBookItemIDs) {
                rejectBooks.push({
                    LendingID: createRejectLending.LendingID,
                    BookItemID: item,
                });
            }

            await LendingBookList.bulkCreate(rejectBooks, { transaction: t });

            await BookItem.update({
                Status: "available",
            }, { where: { BookItemID: req.body.rejectBookItemIDs }, transaction: t });

            await LendingList.update({
                Status: "borrow",
            }, { where: { LendingID: lendingid }, transaction: t });
        }
        await t.commit();
        res.status(200).send({
            message: "Confirmed Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while lendingbook",
        });
        await t.rollback();
    }
};

// Return Book (admin)
exports.returnLending = async(req, res) => {
    const lendingid = req.params.id;
    const t = await seq.transaction();
    try {
        const getLending = await LendingList.findOne({
            where: { LendingID: lendingid },
            attributes: ["AccountID", "CreateDate", "DueDate"],
        });
        let status = "return";
        if (!moment(getLending.DueDate).isBefore(moment)) {
            status = "return";
        } else {
            status = "late";
        }
        // If there is not keep Book Item ID => return all book in lending list
        if (req.body.keepBookItemIDs.length === 0) {
            await LendingList.update({
                ReturnDate: moment(),
                Status: status,
            }, { where: { LendingID: lendingid }, transaction: t });
            await BookItem.update({
                Status: "available",
            }, { where: { BookItemID: req.body.returnBookItemIDs }, transaction: t });
        }
        // If there are A book item keep, B book item return
        // Split Lending into 2 different Lending
        // One contain books that still borrowed, and other contain returned books
        else if (
            req.body.keepBookItemIDs.length !== 0 &&
            req.body.returnBookItemIDs.length !== 0
        ) {
            const createReturnLending = await LendingList.create({
                LendingID: uuidv4(),
                AccountID: getLending.AccountID,
                CreateDate: getLending.CreateDate,
                DueDate: getLending.DueDate,
                ReturnDate: moment(),
                Status: status,
            }, { transaction: t });

            await LendingBookList.destroy({
                where: {
                    LendingID: lendingid,
                    BookItemID: req.body.returnBookItemIDs,
                },
            }, { transaction: t });

            const returnBooks = [];
            for (const item of req.body.returnBookItemIDs) {
                returnBooks.push({
                    LendingID: createReturnLending.LendingID,
                    BookItemID: item,
                });
            }

            await LendingBookList.bulkCreate(returnBooks, { transaction: t });

            await BookItem.update({
                Status: "available",
            }, { where: { BookItemID: req.body.returnBookItemIDs }, transaction: t });
        }
        await t.commit();
        res.status(200).send({
            message: "Create Return Lending Success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while create return lending",
        });
        await t.rollback();
    }
};