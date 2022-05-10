module.exports = (sequelize, Sequelize) => {
    const LendingBookList = sequelize.define("bookitem", {
        LendingID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            references: {
                model: "lendinglist",
                key: "LendingID",
            },
        },
        BookItemID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            references: {
                model: "bookitem",
                key: "BookItemID",
            },
        },
    });

    return LendingBookList;
};