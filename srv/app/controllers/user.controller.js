const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const User = db.user;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  const username = req.body.username;
  if (
    !username ||
    username.length < 3 ||
    username.length > 13 ||
    !/^[\w.]*$/.test(username)
  ) {
    res.status(400).send({ message: "Wrong username format!" });
    return;
  }

  // Create a User
  const user = new User({
    username: username,
    passId: uuidv4(),
    history: [],
  });

  // Save User in the database
  user
    .save(user)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      })
    );
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  // No validation because it's a GET request
  User.findById(req.params.id, "-passId -history")
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "User not found with id " + id });
      else res.send(data);
    })
    .catch((_) => {
      res.status(500).send({ message: "Error retrieving User with id=" + id });
    });
};

// Find a single User with a passId
exports.findByPassId = (req, res, sendData) => {
  const passId = req.params.passId;
  // No validation because it's a GET request
  User.findOne({ passId: passId }, "-passId")
    .then((data) => {
      if (!data) res.status(404).send({ message: "Not found user..." });
      else return sendData ? res.send(data) : data;
    })
    .catch((_) => {
      res.status(500).send({ message: "Error server..." });
    });
};

// Update a User id in the request
exports.update = (req, res) => {
  // Validate request
  const { passId, username } = req.body;

  if (!passId || !username) {
    return res.status(400).send({
      message: "Data is incomplete!",
    });
  }

  User.findOneAndUpdate({ passId: passId }, { username: username })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User. Maybe User was not found!`,
        });
      } else res.send({ message: "Username was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User",
      });
    });
};
