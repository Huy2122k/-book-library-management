module.exports = (sequelize, Sequelize) => {
    const WishList = sequelize.define("wishlist", {
        BookID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            references: {
                model: "book",
                key: "BookID",
            },
        },
        AccountID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            references: {
                model: "account",
                key: "AccountID",
            },
        }
    });

    return WishList;
};