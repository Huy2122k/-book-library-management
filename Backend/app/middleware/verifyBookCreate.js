const checkRequestForm = (req, res, next) => {
    console.log(req.body);
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    next();
};

module.exports = { checkRequestForm };