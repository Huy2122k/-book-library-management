var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS,
    },
});

const sendToEmail = async(email, subject, content, callback) => {
    const mailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject: subject,
        html: content,
    };
    transporter.sendMail(mailOptions, callback);
};

module.exports = sendToEmail;