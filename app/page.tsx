"use client";

import ChatBot from "./chat/ChatBot";
import "./ChatBot.css";
import AuthWrapper from "./components/Auth/AuthWrapper";

export default function Home() {
  return (
    <AuthWrapper requireAuth={true}>
      <ChatBot />
    </AuthWrapper>
  );
}
