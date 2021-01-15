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

// Find a single User with an id
exports.findOne = (req, res) => {
    // No validation because it's a GET request

    User.findById(req.params.id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "User not found with id " + req.params.id});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({message: "Error retrieving User with id=" + req.params.id});
        });
};

// Find a single User with a passId
exports.findByPassId = (req, res) => {
    // No validation because it's a GET request

    User.findOne({"passId": req.params.passId})
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found Task with passId " + req.params.passId});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({message: "Error retrieving Task with passId=" + req.params.passId});
        });
};

// Update a User id in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body.id) {
        return res.status(400).send({
            message: "Data is incomplete!"
        });
    }

    User.findByIdAndUpdate(req.body.id, req.body, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update User with id=${req.body.id}. Maybe User was not found!`
                });
            } else res.send({message: "User was updated successfully."});
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + req.body.id
            });
        });
};