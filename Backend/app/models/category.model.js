module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
        CategoryID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        CategoryName: {
            type: Sequelize.STRING,
        },
    });

    return Category;
};