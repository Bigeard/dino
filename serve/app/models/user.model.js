const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
      history: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'game'
      }]
  })
);

module.exports = User;
