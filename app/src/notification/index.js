import axios from "axios";

export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const publicVapidKey =
  "BLQNszZ_CFPbPnu2lFsofwbX0rj1IsBp7hIfsqB7T8FtnUYan3wBLRG1izPpHXhyCDbTXk6-p88KvNDbvezMVGE";

  export async function activatePushNotification() {
    if ("serviceWorker" in navigator) {
      const register = await navigator.serviceWorker.register(
        "/service-worker.js",
        {
          scope: "/"
        }
      );
      //regsister push
      await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
    } else {
      console.error("Service workers are not supported in this browser");
    }
  }

export async function createGamePushNotification() {
  if ("serviceWorker" in navigator) {
    const register = await navigator.serviceWorker.register(
      "/service-worker.js",
      {
        scope: "/"
      }
    );
    //regsister push
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    //send push notif
    const body = JSON.stringify(subscription);
    await axios
      .post("http://localhost:8000/api/notification/create-game", body, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .catch(error => {
        console.error("There was an error notification !", error);
      });
  } else {
    console.error("Service workers are not supported in this browser");
  }
}

export async function winGamePushNotification() {
  if ("serviceWorker" in navigator) {
    const register = await navigator.serviceWorker.register(
      "/service-worker.js",
      {
        scope: "/"
      }
    );
    //regsister push
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    //send push notif
    const body = JSON.stringify(subscription);
    await axios
      .post("http://localhost:8000/api/notification/end-game", body, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .catch(error => {
        console.error("There was an error notification !", error);
      });
  } else {
    console.error("Service workers are not supported in this browser");
  }
}

export async function turnGamePushNotification() {
  if ("serviceWorker" in navigator) {
    const register = await navigator.serviceWorker.register(
      "/service-worker.js",
      {
        scope: "/"
      }
    );
    //regsister push
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    //send push notif
    const body = JSON.stringify(subscription);
    await axios
      .post("http://localhost:8000/api/notification/turn-game", body, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .catch(error => {
        console.error("There was an error notification !", error);
      });
  } else {
    console.error("Service workers are not supported in this browser");
  }
}
