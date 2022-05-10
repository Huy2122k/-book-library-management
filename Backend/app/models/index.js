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
db.account = require("./account.model.js")(sequelize, Sequelize);
db.lendingList = require("./lending-list.model.js")(sequelize, Sequelize);
db.lendingBookList = require("./lending-book-list.model.js")(
    sequelize,
    Sequelize
);

db.book.hasMany(db.bookItem);
db.category.hasMany(db.book);
db.account.hasMany(db.lendingList);
db.lendingList.hasMany(db.lendingBookList);
db.bookItem.hasMany(db.lendingBookList);

module.exports = db;