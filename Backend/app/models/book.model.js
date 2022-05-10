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
        Description: {
            type: Sequelize.TEXT,
        },
        CategoryID: {
            type: Sequelize.INTEGER,
            references: {
                model: "category",
                key: "CategoryID",
            },
        },
        ImageURL: {
            type: Sequelize.STRING,
        },
    });

    return Book;
};