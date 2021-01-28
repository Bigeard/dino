module.exports = app => {
    const notification = require("../controllers/notification.controller.js");

    var router = require("express").Router();

    // Create and push Notification create game
    router.post("/create-game/", notification.createGame)

    // Create and push Notification end game
    router.post("/end-game/", notification.endGame)

    // Create and push Notification you turn
    router.post("/turn-game/", notification.turnGame)

    // Create and push Notification remaining time
    router.post("/timeturn-game/", notification.timeTurnGame)

    app.use("/api/notification", router);
};