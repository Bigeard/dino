/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

/* importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
  "/precache-manifest.abec39199269d0effe0bd526594136d8.js"
);

workbox.core.setCacheNameDetails({prefix: "dino"});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); */

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
/* self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {}); */

self.addEventListener("install", (event) => {
  console.log("Installing");
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});

//push notif
self.addEventListener('push', event => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: 'You have create new game !',
    icon: 'img/icons/favicon-32x32.png',
  });
});

self.addEventListener("notificationclick", (event) => {
  event.preventDefault();
  event.notification.close();
  if(event.action){
      event.waitUntil(self.clients.openWindow(`/?origin=${event.action}`));
  }
  else{
      event.waitUntil(self.clients.openWindow("/?origin=noaction"));
  }
  
});