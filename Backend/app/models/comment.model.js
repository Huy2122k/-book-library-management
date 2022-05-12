module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        CommentID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        AccountID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            references: {
                model: "account",
                key: "AccountID",
            },
        },
        BookID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            references: {
                model: "book",
                key: "BookID",
            },
        },
        Comment: {
            type: Sequelize.TEXT,
        },
        CreateDate: {
            type: Sequelize.DATE,
        },
        Status: {
            type: Sequelize.STRING,
        },
    });

    return Comment;
};