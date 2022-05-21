const dbConfig = require("../config/db.config.js");
console.log(dbConfig);
console.log("hehe");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    operatorsAliases: 0,
    define: {
        timestamps: false,
        freezeTableName: true,
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.book = require("./book.model.js")(sequelize, Sequelize);
db.bookItem = require("./book-item.model.js")(sequelize, Sequelize);
db.category = require("./category.model.js")(sequelize, Sequelize);
db.bookCategory = require("./book-category.model.js")(sequelize, Sequelize);
db.account = require("./account.model.js")(sequelize, Sequelize);
db.lendingList = require("./lending-list.model.js")(sequelize, Sequelize);
db.lendingBookList = require("./lending-book-list.model.js")(sequelize, Sequelize);
db.rating = require("./rating.model.js")(sequelize, Sequelize);
db.comment = require("./comment.model.js")(sequelize, Sequelize);
db.wishlist = require("./wishlist.model.js")(sequelize, Sequelize);

// relation that exist in the EER Diagram
db.book.hasMany(db.bookItem, {foreignKey: 'BookID'});
db.bookItem.belongsTo(db.book, {foreignKey: 'BookID'});

db.book.hasMany(db.bookCategory, {foreignKey: 'BookID'});
db.bookCategory.belongsTo(db.book, {foreignKey: 'BookID'});

db.category.hasMany(db.bookCategory, {foreignKey: 'CategoryID'});
db.bookCategory.belongsTo(db.category, {foreignKey: 'CategoryID'});

db.account.hasMany(db.lendingList, {foreignKey: 'AccountID'});
db.lendingList.belongsTo(db.account, {foreignKey: 'AccountID'});

db.lendingList.hasMany(db.lendingBookList, {foreignKey: 'LendingID'});
db.lendingBookList.belongsTo(db.lendingList, {foreignKey: 'LendingID'});

db.bookItem.hasMany(db.lendingBookList, {foreignKey: 'BookItemID'});
db.lendingBookList.belongsTo(db.bookItem, {foreignKey: 'BookItemID'});

db.account.hasMany(db.wishlist, {foreignKey: 'AccountID'})
db.wishlist.belongsTo(db.account, {foreignKey: 'AccountID'})

db.book.hasMany(db.wishlist, {foreignKey: 'BookID'})
db.wishlist.belongsTo(db.book, {foreignKey: 'BookID'})

db.account.hasMany(db.comment, {foreignKey: 'AccountID'})
db.comment.belongsTo(db.account, {foreignKey: 'AccountID'})

db.book.hasMany(db.comment, {foreignKey: 'BookID'})
db.comment.belongsTo(db.book, {foreignKey: 'BookID'})

db.book.hasMany(db.rating, {foreignKey: 'BookID'});
db.rating.belongsTo(db.book, {foreignKey: 'BookID'});

db.account.hasMany(db.rating, {foreignKey: 'AccountID'})
db.rating.belongsTo(db.account, {foreignKey: 'AccountID'})

// relation that not exist in the EER Diagram
db.rating.hasMany(db.comment, {foreignKey: ['AccountID', 'BookID']})
db.comment.belongsTo(db.rating, {foreignKey: ['AccountID', 'BookID']})

module.exports = db;