require('dotenv').config({ path: 'variables.env' });
const express = require("express");
const webPush = require('web-push');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

const app = express();

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

const PORT = process.env.PORT || 8000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

//------- notif -------
app.use(express.static(path.join(__dirname, '../app')));
webPush.setVapidDetails('mailto:pageauxclement@gmail.com', publicVapidKey, privateVapidKey);

// Subscribe route

app.post('/subscribe', (req, res) => {
  const subscription = req.body

  res.status(201).json({});

  // create payload
  const payload = JSON.stringify({
    title: 'New notif to Dino Game',
    body: 'Game is created !',
    icon: 'img/icons/favicon-32x32.png'
  });

  webPush.sendNotification(subscription, payload)
    .catch(error => console.error(error));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
