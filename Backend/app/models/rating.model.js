module.exports = (sequelize, Sequelize) => {
    const Rating = sequelize.define("rating", {
        BookID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            references: {
                model: "book",
                key: "BookID",
            },
            primaryKey: true,
        },
        AccountID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            references: {
                model: "account",
                key: "AccountID",
            },
            primaryKey: true,
        },
        Rating: {
            type: Sequelize.INTEGER,
        }
    });

    return Rating;
};