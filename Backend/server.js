require("dotenv").config();
const cron = require("cron");
const sendReturnLateMail =
    require("./app/controllers/lending.controller").sendReturnLateMail; // require module gửi mail cảnh báo

const express = require("express");
const cors = require("cors");
const redis = require("redis");
const app = express();

var corsOptions = {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:8081",
};
var clientRedis = redis.createClient(6379);
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Library!" });
});

require("./app/routes/book.routes")(app);
require("./app/routes/wishlist.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/admin.user.routes")(app);
require("./app/routes/admin.book.routes")(app);
require("./app/routes/lending.routes")(app);

//send mail to user every day if user not return
const job = new cron.CronJob({
    cronTime: "00 30 23 * * 0-6", // Chạy Jobs vào 23h30 hằng đêm
    onTick: function() {
        sendReturnLateMail();
        console.log("Cron jub runing...");
    },
    start: true,
    timeZone: "Asia/Ho_Chi_Minh",
});

job.start();

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});