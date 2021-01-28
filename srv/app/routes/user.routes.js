module.exports = app => {
    const user = require("../controllers/user.controller.js");

    var router = require("express").Router();

    // Create a new user
    router.post("/create/", user.create);

    // Retrieve all users
    //router.get("/", user.findAll);

    // Retrieve a single user with id
    router.get("/readById/:id", user.findOne);

    // Retrieve a single user with passId
    router.post("/readByPassId", user.findByPassId);

    // Update a user with id
    router.patch("/update/", user.update)

    app.use("/api/user", router);
};