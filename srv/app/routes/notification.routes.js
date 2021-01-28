module.exports = app => {
    const notification = require("../controllers/notification.controller.js");

    var router = require("express").Router();

    // Create and push Notification
    router.post("/subscribe/", notification.subscribe)

    app.use("/api/notification", router);
};