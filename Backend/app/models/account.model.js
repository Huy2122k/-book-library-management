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
        Introduction: {
            type: Sequelize.TEXT,
        },
        Gender: {
            type: Sequelize.STRING,
        },
        Birthday: {
            type: Sequelize.DATE,
        },
        IdentityNum: {
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
        ImageURL: {
            type: Sequelize.STRING,
        },
        Role: {
            type: Sequelize.STRING,
        },
        Status: {
            type: Sequelize.STRING,
        },
        EmailStatus: {
            type: Sequelize.STRING,
        },
        IdentityStatus: {
            type: Sequelize.STRING,
        },
        FrontsideURL: {
            type: Sequelize.STRING,
        },
        BacksideURL: {
            type: Sequelize.STRING,
        },
        FaceURL: {
            type: Sequelize.STRING,
        },
    });

    return Account;
};