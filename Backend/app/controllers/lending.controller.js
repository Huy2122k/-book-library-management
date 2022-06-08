const db = require("../models");
const LendingList = db.lendingList;
const LendingBookList = db.lendingBookList;
const BookItem = db.bookItem;
const Book = db.book;
const Op = db.Sequelize.Op;
const seq = db.sequelize;
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

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
        }
        if (req.body.BorrowBookList.length + numOfBorrowBook > 10) {
            res.status(400).send({
                message: "Borrow Book exceed the limit",
            });
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
            res.status(204).send({
                message: "Exist Books are not available",
                unavailableBookList,
            });
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