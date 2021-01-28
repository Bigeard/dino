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
  if (!navigator.onLine) {
    if (event.request.url ==='http://127.0.0.1:8080/js/chunk-vendors.c5e1e230.js') {
      event.waitUntil(
        this.registration.showNotification("Internet",{
          body: "You are offline",
        })
      );
    }
  }
});

//push notif
self.addEventListener("push", function onPush(event) {
  const data = event.data.json()
  console.log(1, data);
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
    actions: [ 
      { action: 'Button one', title: "Button one text" },
      { action: 'Button two', title: "Button two text" }
    ]
  }));
});