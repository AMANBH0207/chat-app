"use client";

import { useEffect, useState } from "react";
import ComingSoon from "../components/ComingSoon";
import ChatSideBar from "../components/ChatSideBar";
import NoChatSelected from "../components/NoChatSelected";

function ChatBot() {
  const [selectedChat, setSelectedChat] = useState<{
    name: string | null;
    id: string | null;
  }>({
    name: null,
    id: null,
  });

  const [selectedMenu, setSelectedMenu] = useState<string>("chats");
  const [activeTab, setActiveTab] = useState("recent");

  useEffect(() => {
    const sidebar = document.getElementById("chatSidebar");
    const resizer = document.getElementById("sidebarResizer");

    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;
    if (!sidebar || !resizer || !isDesktop()) return;

    let startX = 0;
    let startWidth = 0;

    const mouseDownHandler = (e: MouseEvent) => {
      if (!isDesktop()) return;

      startX = e.clientX;
      startWidth = sidebar.offsetWidth;

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      sidebar.style.width =
        Math.min(Math.max(220, newWidth), 500) + "px";
    };

    const mouseUpHandler = () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    resizer.addEventListener("mousedown", mouseDownHandler);

    return () => {
      resizer.removeEventListener("mousedown", mouseDownHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };
  }, []);

  return (
    <div className="chatbot-page">
      <div className="container-fluid p-0">
        <div className="chat-wrapper d-flex">
          <ChatSideBar
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <></>

          {selectedMenu === "chats" ? (
            !selectedChat?.id ? (
              <NoChatSelected />
            ) : (
              <div></div>
              // <ChatArea
              //   selectedChat={selectedChat}
              //   setSelectedChat={setSelectedChat}
              // />
            )
          ) : (
            <ComingSoon
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBot;