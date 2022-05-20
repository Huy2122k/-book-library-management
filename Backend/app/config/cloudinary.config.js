const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const multer = require("multer");
var md5 = require("md5");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const storageBook = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png"],
    params: {
        folder: "bookImage",
        public_id: (req, file) => md5(JSON.stringify(file)),
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});
const storageUser = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png"],
    params: {
        folder: "userImage",
        public_id: (req, file) => req.userId,
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});
const bookImg = multer({ storage: storageBook });
const userImg = multer({ storage: storageUser });

const uploadCloud = { bookImg, userImg };
module.exports = uploadCloud;