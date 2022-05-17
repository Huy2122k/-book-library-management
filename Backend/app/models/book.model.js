module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define("book", {
        BookID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        BookName: {
            type: Sequelize.TEXT,
        },
        Author: {
            type: Sequelize.STRING,
        },
        Series: {
            type: Sequelize.STRING,
        },
        Chapter: {
            type: Sequelize.INTEGER,
        },
        Description: {
            type: Sequelize.TEXT,
        },
        PublishedDate: {
            type: Sequelize.DATE
        },
        Publisher: {
            type: Sequelize.STRING
        },
        Price: {
            type: Sequelize.INTEGER,
        },
        ImageURL: {
            type: Sequelize.STRING,
        },
    });
    return Book;
};