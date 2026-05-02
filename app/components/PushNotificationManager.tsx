import { useEffect } from "react";
import { urlBase64ToUint8Array } from "../utils/webPush";

// Replace with your actual backend URL and public key
const BACKEND_URL = "http://localhost:5000"; 
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY; 

export default function PushNotificationManager() {
  const registerAndSubscribe = async () => {
    try {
      // 1. Register the Service Worker
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered");

      // 2. Wait for the service worker to be ready
      await navigator.serviceWorker.ready;

      // 3. Request permission and subscribe
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      console.log("User is subscribed:", subscription);

      // 4. Send the subscription to your backend
      await sendSubscriptionToBackend(subscription);

    } catch (error) {
      console.error("Error during service worker registration or subscription:", error);
    }
  };

  const sendSubscriptionToBackend = async (subscription:any) => {
    // Remember to pass your auth token (cookies are sent automatically if configured)
    await fetch(`${BACKEND_URL}/api/users/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
      credentials: "include", // Important for sending your JWT cookie
    });
  };

  useEffect(() => {
    // Check if the browser supports service workers and push messages
    if ("serviceWorker" in navigator && "PushManager" in window) {
      registerAndSubscribe();
    }
  }, []);

  return null; // This component handles logic quietly in the background
}
