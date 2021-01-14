const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.item = require("./item.model")(mongoose);
db.action = require("./action.model")(mongoose);
db.player = require("./player.model")(mongoose);
db.game = require("./game.model")(mongoose);
db.user = require("./user.model")(mongoose);

module.exports = db;
