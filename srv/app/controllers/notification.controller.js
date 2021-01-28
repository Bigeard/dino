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

// Create a new Notification
exports.subscribe = (req, res) => {
  const subscription = req.body;
  console.log(1, subscription);

  res.status(201).json({});

  // create payload
  const payload = JSON.stringify({
    title: "New notif to Dino Game",
    body: "Game is created !",
    icon: "img/icons/favicon-32x32.png",
  });

  webPush
    .sendNotification(subscription, payload)
    .catch((error) => console.error(error));
};
