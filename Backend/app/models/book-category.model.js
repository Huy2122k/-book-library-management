module.exports = (sequelize, Sequelize) => {
    const BookCategory = sequelize.define("bookcategory", {
        BookID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            references: {
                model: "book",
                key: "BookID",
            },
            primaryKey: true,
        },
        CategoryID: {
            type: Sequelize.INTEGER,
            references: {
                model: "category",
                key: "CategoryID",
            },
            primaryKey: true,
        },
    });

    return BookCategory;
};