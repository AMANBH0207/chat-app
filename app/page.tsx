"use client";
import ChatBot from "./chat/ChatBot";
import "./ChatBot.css";
import AuthWrapper from "./components/Auth/AuthWrapper";
import PushNotificationManager from "./components/PushNotificationManager";

export default function Home() {
  return (
    <AuthWrapper requireAuth={true}>
      <PushNotificationManager />
      <ChatBot />
    </AuthWrapper>
  );
}
