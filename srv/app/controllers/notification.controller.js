const express = require("express");
const webPush = require('web-push');
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

//------- notif -------
webPush.setVapidDetails(
  "mailto:pageauxclement@gmail.com",
  publicVapidKey,
  privateVapidKey
);

// Create a new Notification create game
exports.createGame = (req, res) => {
  const subscription = req.body;
  console.log(1, subscription);

  res.status(201).json({});

  // create payload
  const payload = JSON.stringify({
    title: "New notif to Dino Game",
    body: "You have create new game !",
    icon: "img/icons/favicon-32x32.png",
  });

  webPush
    .sendNotification(subscription, payload)
    .catch((error) => console.error(error));
};

// Create a new Notification end game
exports.endGame = (req, res) => {
  const subscription = req.body;
  console.log(1, subscription);

  res.status(201).json({});

  // create payload
  const payload = JSON.stringify({
    title: "New notif to Dino Game",
    body: "You win !",
    icon: "img/icons/favicon-32x32.png",
  });

  webPush
    .sendNotification(subscription, payload)
    .catch((error) => console.error(error));
};

// Create a new Notification your turn
exports.turnGame = (req, res) => {
  const subscription = req.body;
  console.log(1, subscription);

  res.status(201).json({});

  // create payload
  const payload = JSON.stringify({
    title: "New notif to Dino Game",
    body: "It's your turn !",
    icon: "img/icons/favicon-32x32.png",
  });

  webPush
    .sendNotification(subscription, payload)
    .catch((error) => console.error(error));
};

// Create a new Notification remaining time
exports.timeTurnGame = (req, res) => {
  const subscription = req.body;
  console.log(1, subscription);

  res.status(201).json({});

  // create payload
  const payload = JSON.stringify({
    title: "New notif to Dino Game",
    body: "You have less than 24 hours to play !",
    icon: "img/icons/favicon-32x32.png",
  });

  webPush
    .sendNotification(subscription, payload)
    .catch((error) => console.error(error));
};