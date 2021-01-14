module.exports = app => {
    const item = require("../controllers/item.controller.js");

    var router = require("express").Router();

    // Retrieve all items
    router.get("/", item.findAll);

    // Retrieve a single item with id
    router.get("/:id", item.findOne);

    app.use("/api/item", router);
};