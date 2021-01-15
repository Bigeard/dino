const db = require("../models");
const User = db.user;

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.username) {
        res.status(400).send({message: "Username can not be empty!"});
        return;
    }

    // Create a User
    const user = new User({
        username: req.body.username,
        passId: Math.random().toString(36).substr(2, 9),
        history: []
    });

    // Save User in the database
    user
        .save(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};
