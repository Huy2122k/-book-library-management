module.exports = (sequelize, Sequelize) => {
    const LendingBookList = sequelize.define("lendingbooklist", {
        LendingID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            references: {
                model: "lendinglist",
                key: "LendingID",
            },
            primaryKey: true,
        },
        BookItemID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            references: {
                model: "bookitem",
                key: "BookItemID",
            },
            primaryKey: true,
        },
    });

    return LendingBookList;
};