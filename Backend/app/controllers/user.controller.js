exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
exports.uploadAvatar = (req, res) => {
    if (!req.file) {
        res.status(400).send(new Error("Cannot uploaded book image!"));
        return;
    }
    res.send(req.file);
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};