"use client";
import ChatBot from "./chat/ChatBot";
import "./ChatBot.css";
import { useEffect } from "react";
import { getMe } from "./store/Auth/authThunks";
import { useAppDispatch } from "./store/hooks";

export default function Home() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getMe());
  }, []);

  return (
    <ChatBot/>
  );
}
