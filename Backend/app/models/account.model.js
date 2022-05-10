module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define("account", {
        AccountID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        UserName: {
            type: Sequelize.STRING,
        },
        Password: {
            type: Sequelize.STRING,
        },
        Address: {
            type: Sequelize.STRING,
        },
        Email: {
            type: Sequelize.STRING,
        },
        Phone: {
            type: Sequelize.STRING,
        },
        Role: {
            type: Sequelize.STRING,
        },
        Status: {
            type: Sequelize.STRING,
        },
    });

    return Account;
};