module.exports = (sequelize, Sequelize) => {
    const WishList = sequelize.define("wishlist", {
        BookID: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        AccountID: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
    });

    return WishList;
};