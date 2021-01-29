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
const DATABASE = "dino";
const VERSION = 10;

/**
 * The function get value in the indexedDB
 * @param {String} tab Table
 * @param {String} val The search value
 */
const get = (tab, val) => {
  const req = indexedDB.open(DATABASE, VERSION);
  return new Promise(resolve => {
    req.onsuccess = () => {
      const db = req.result;
      const tran = db.transaction([tab], "readonly");
      const store = tran.objectStore(tab);
      const cursorRequest = store.get(val);
      cursorRequest.onsuccess = e => resolve(e.target.result);
    };
  });
};

/**
 * The function add value in the indexedDB
 * @param {String} tab Table
 * @param {String} val The search value
 */
const add = (tab, val) => {
  const req = indexedDB.open(DATABASE, VERSION);
  return new Promise(resolve => {
    req.onsuccess = () => {
      const db = req.result;
      const tran = db.transaction([tab], "readwrite");
      const store = tran.objectStore(tab);
      store.add(val);
      resolve();
    };
  });
};

/**
 * The function get all value in the indexedDB
 * @param {String} tab Table
 * @param {String} idx Index (ex: _id)
 * @param {String} val The search value
 */
const getAll = (tab, idx, val) => {
  const req = indexedDB.open(DATABASE, VERSION);
  return new Promise(resolve => {
    req.onsuccess = () => {
      const db = req.result;
      const tran = db.transaction([tab], "readonly");
      const store = tran.objectStore(tab);
      const cursorRequest = store.openCursor();
      cursorRequest.onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) {
          if (cursor.value[idx] === val) return resolve(cursor.value);
          cursor.continue();
        }
      };
    };
  });
};

const getResponse = async req => {
  const response = await caches.match(req);
  if (response) {
    return response;
  } else {
    if (
      req.url === "https://dino-srv.azurewebsites.net/api/game/readByCode" &&
      !navigator.onLine
    ) {
      const val = await req.json();
      const game = await get("game", val.code);
      return new Response(JSON.stringify(game));
    } else if (
      req.url === "https://dino-srv.azurewebsites.net/api/game/action" &&
      !navigator.onLine
    ) {
      add("action", {
        id: Date.now(),
        body: await req.json(),
        status: "wait",
        updated_at: null,
        created_at: new Date()
      });
      return new Response();
    }
    return fetch(req);
  }
};

// self.addEventListener("install", event => {
//   console.log("Installing");
// });

self.addEventListener("fetch", event => {
  event.respondWith(getResponse(event.request));
});
