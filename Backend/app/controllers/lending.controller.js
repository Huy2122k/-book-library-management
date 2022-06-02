const db = require("../models");
const LendingList = db.lendingList;
const LendingBookList = db.lendingBookList;
const BookItem = db.bookItem;
const Book = db.book;
const seq = db.sequelize;
const { v4: uuidv4 } = require("uuid");
const moment = require('moment')

// Create Lending
exports.createLending = async(req, res) => {
    const accountid = req.params.id;
    const t = await seq.transaction();
    try {
        // Check if number of borrow book + number of book in the create lending exceed the borrow book limit
        const numOfBorrowBook = await LendingList.count({
            include: [{
                model: LendingBookList,
                attributes: ["LendingID"]
            }],
            where: {"AccountID": accountid, "Status": "borrow"}
        })
        if (req.body.BorrowBookList.length+numOfBorrowBook>10){
            res.status(400).send({
                message: "Borrow Book exceed the limit"
            });
            return;
        }
        // Check if exist bookitem in book in the create lending list is available
        const availableBook = await BookItem.findAll({
            where: {"BookID": req.body.BorrowBookList, "Status": "available"},
            group: ["BookID"],
            attributes: ["BookID", "BookItemID"]
        })
        const availableBookList = availableBook.map((element) => element.BookID)
        const unavailableBookList = req.body.BorrowBookList.filter(x => !availableBookList.includes(x));
        if (unavailableBookList.length>0){
            res.status(400).send({
                message: "Exist Books are not available", unavailableBookList
            });
            return;
        }

        const createLending = await LendingList.create({
            LendingID: uuidv4(),
            AccountID: accountid,
            CreateDate: moment(),
            DueDate: moment().add(6, 'months'),
            ReturnDate: null,
            Status: "pending",
        }, /*{ transaction: t }*/);

        const bookItemList = availableBook.map((element) => element.BookItemID)
        const lendingBooks = []
        for (const item of bookItemList) { 
            lendingBooks.push({
                LendingID: createLending.LendingID,
                BookItemID: item,
            })
        }
        const createLendingBook = await LendingBookList.bulkCreate(lendingBooks, /*{ transaction: t }*/)
        const updateBookItem = await BookItem.update({
            Status: "unavailable"
        }, {where: {"BookItemID": bookItemList}}, /*{ transaction: t }*/)
        console.log(bookItemList)
        await t.commit();
        res.status(200).send({
            message: "Create Success"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tutorials.",
        });
        await t.rollback();
    }
};