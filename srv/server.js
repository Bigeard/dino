const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8000;

var corsOptions = {
  origin: ["http://localhost:${PORT}"]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//routes
//require("./app/routes/action.routes")(app);
//require("./app/routes/game.routes")(app);
//require("./app/routes/item.routes")(app);
//require("./app/routes/player.routes")(app);
require("./app/routes/user.routes")(app);


// simple route
app.get("/", (req, res) => {
  res.json({ message: "dino-game.tech 's API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
