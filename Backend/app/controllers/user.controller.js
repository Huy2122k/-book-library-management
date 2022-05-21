const db = require("../models");
const seq = db.sequelize;
const Account = db.account;
const Rating = db.rating;
const Comment = db.comment;
const Book = db.book;
const BookItem = db.bookItem;
const LendingList = db.lendingList;
const LendingBookList = db.lendingBookList;
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
exports.uploadAvatar = (req, res) => {
    if (!req.file) {
        res.status(400).send(new Error("Cannot uploaded book image!"));
        return;
    }
    res.send(req.file);
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getAccountInfo = async(req, res) => {
  const accountid = req.params.id;
  const token = req.headers["x-access-token"];
  if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
          if (err) {
              return;
          }
          req.userId = decoded.id;
          req.role = decoded.role;
      });
  }
  const userinfo = (req.userId===req.params.id||req.role==='admin')?
                   ['UserName', 'Introduction', 'Birthday', 'Gender', 'ImageURL', 'Email', 'Phone', 'IdentityNum', 'Address']
                   :['UserName', 'Introduction', 'Birthday', 'Gender', 'ImageURL'];
  try {
    const info = await Account.findOne({
      where: {AccountID: accountid},
      attributes: userinfo,
    });
    const bookRating = await Rating.findAll({
      where: {AccountID: accountid},
      include: [{
        model: Book,
        attributes: ['BookID', 'BookName', 'Author', 'ImageURL']
    }],
      attributes: ['Rating'],
    });
    const bookComment = await Comment.findAll({
      where: {AccountID: accountid},
      include: [{
              model: Rating,
              on: {
                  col1: seq.where(
                      seq.col("Comment.BookID"),
                      "=",
                      seq.col("Rating.BookID")
                  ),
                  col2: seq.where(
                      seq.col("Comment.AccountID"),
                      "=",
                      seq.col("Rating.AccountID")
                  ),
              },
              attributes: ["Rating"],
          },
          {
              model: Book,
              on: {
                  col1: seq.where(
                      seq.col("Comment.BookID"),
                      "=",
                      seq.col("Book.BookID")
                  ),
              },
              attributes: ["BookName"],
          },
      ],
      attributes: ["CommentID", "BookID", "Comment", "CreateDate"],
    });
    const lendingList = await LendingList.findAll({
      where: {AccountID: accountid},
      include: [{
              model: LendingBookList,
              include: [{
                model: BookItem,
                include: [{
                  model: Book,
                  attribute: ["BookID", "BookName", "Author"]
                }],
                attribute: ["BookItemID"],
              }],
              attributes: ["LendingID"],
          }
      ],
      attributes: ["LendingID", "CreateDate", "DueDate", "ReturnDate"],
    });
    res.status(200).send({
      accountInfo: info,
      ratingInfo: bookRating,
      commentInfo: bookComment,
      lendingInfo: lendingList,
  });
  } catch (err) {
    console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials.",
        });
  }
}
