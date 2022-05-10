module.exports = (sequelize, Sequelize) => {
    const BookItem = sequelize.define("bookitem", {
        BookID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            references: {
                model: "book",
                key: "BookID",
            },
        },
        BookItemID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        Position: {
            type: Sequelize.STRING,
        },
        Status: {
            type: Sequelize.STRING,
        },
    });

    return BookItem;
};