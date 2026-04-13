"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import NavigationBar from "./NavigationBar";
import Image from "next/image";
import { useAppDispatch } from "../store/hooks";
import { searchUsers } from "../store/User/userThunks";
import { getMyRooms, joinRoom } from "../store/Rooms/roomsThunks";
import { User } from "../store/User/userTypes";
interface SelectedChatType {
  id: string | null;
  name: string | null;
  room_id: string | null;
}

interface ChatSideBarProps {
  selectedChat: SelectedChatType;
  setSelectedChat: (c: SelectedChatType) => void;
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

function ChatSideBar({
  selectedChat,
  setSelectedChat,
  selectedMenu,
  setSelectedMenu,
  setActiveTab,
  activeTab,
}: ChatSideBarProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [unreadCount, setUnreadCount] = useState(0);
  const dispatch = useAppDispatch();

  let emptyIcon = "fa-comment-slash";
  let emptyText = "No Conversation Has Happened Yet";

  if (activeTab === "unread") {
    emptyIcon = "fa-envelope-open-text";
    emptyText = "No Unread Messages";
  }

  const getUsers = async () => {
    try {
      const res = await dispatch(searchUsers(searchTerm)).unwrap();
      setUsers(res);
    } catch (err: unknown) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const timer = setTimeout(() => {
        getUsers();
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [searchTerm]);

  const handleUserClick = async (user: User) => {
    try {
      const res = await dispatch(joinRoom(user._id)).unwrap();
      setSelectedChat({
        name: user?.name,
        id: user?._id,
        room_id: user.room_id,
      });
      // // join socket
      // socket.emit("join_room", res._id);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    dispatch(getMyRooms())
      .unwrap()
      .then((res) => {
        setUsers(res);
        const totalUnread = res.reduce(
          (acc: number, room: any) => acc + (room.unreadCount || 0),
          0,
        );
        setUnreadCount(totalUnread);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
      });
  }, []);

  return (
    <div
      className={`chat-sidebar  chat-sidebar-layout border-end ${
        selectedMenu !== "chats" || selectedChat?.id ? "hide-mobile" : ""
      }`}
      id="chatSidebar"
    >
      {/* Resize Handle */}
      <div className="resize-handle" id="sidebarResizer"></div>

      <div
        className="d-flex sideBarHeader justify-content-between align-items-center headersColor"
        style={{ padding: "25px 10px" }}
      >
        <span className="logo-lg">
          <Image
            src="/assets/images/avatars/Avatar.png"
            alt="Avatar"
            width={45}
            height={45}
          />
        </span>

        <div className="d-flex align-items-center">
          <div className="search-wrapper d-flex align-items-center px-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="me-2 search-icon"
            >
              <path
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="text"
              className="search-input"
              placeholder="Search User"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <span className="p-2">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.47477 16.64C7.78973 16.6327 8.09199 16.5143 8.32807 16.3057C8.56414 16.0971 8.71883 15.8117 8.76477 15.5H6.13477C6.182 15.8202 6.34393 16.1123 6.59042 16.322C6.83691 16.5317 7.15118 16.6447 7.47477 16.64Z"
                fill="white"
              />
              <path
                d="M14.9 13.565L14.73 13.415C14.2477 12.9853 13.8256 12.4925 13.475 11.95C13.0921 11.2012 12.8626 10.3836 12.8 9.54495V7.07495C12.798 6.77493 12.7712 6.47558 12.72 6.17995C11.8731 6.00587 11.1123 5.54446 10.5665 4.87384C10.0207 4.20322 9.72344 3.3646 9.725 2.49995V2.18495C9.20296 1.92805 8.64208 1.75911 8.065 1.68495V1.05495C8.065 0.877919 7.99467 0.708138 7.86949 0.582957C7.74431 0.457777 7.57453 0.387451 7.3975 0.387451C7.22047 0.387451 7.05069 0.457777 6.92551 0.582957C6.80033 0.708138 6.73 0.877919 6.73 1.05495V1.70995C5.43786 1.89223 4.25529 2.53582 3.40061 3.52192C2.54593 4.50801 2.07686 5.77002 2.08 7.07495V9.54495C2.01738 10.3836 1.78789 11.2012 1.405 11.95C1.06044 12.4911 0.645097 12.9838 0.17 13.415L0 13.565V14.975H14.9V13.565Z"
                fill="white"
              />
              <path
                d="M13.4751 5C14.8558 5 15.9751 3.88071 15.9751 2.5C15.9751 1.11929 14.8558 0 13.4751 0C12.0944 0 10.9751 1.11929 10.9751 2.5C10.9751 3.88071 12.0944 5 13.4751 5Z"
                fill="white"
              />
            </svg>
          </span>

          <span className="p-2">
            {" "}
            <svg
              width="24"
              height="22"
              viewBox="0 0 24 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.6555 13.0785C21.9104 13.0785 23.7368 14.8742 23.7368 17.0896C23.7368 19.3037 21.9104 21.0994 19.6555 21.0994C17.4018 21.0994 15.5741 19.3037 15.5741 17.0896C15.5741 14.8742 17.4018 13.0785 19.6555 13.0785ZM9.59359 15.379C10.5813 15.379 11.3831 16.1668 11.3831 17.1371C11.3831 18.1062 10.5813 18.8952 9.59359 18.8952H1.78948C0.801773 18.8952 0 18.1062 0 17.1371C0 16.1668 0.801773 15.379 1.78948 15.379H9.59359ZM4.0814 0C6.33638 0 8.16279 1.79567 8.16279 4.00982C8.16279 6.22526 6.33638 8.02093 4.0814 8.02093C1.82773 8.02093 0 6.22526 0 4.00982C0 1.79567 1.82773 0 4.0814 0ZM21.9487 2.25301C22.9351 2.25301 23.7368 3.04072 23.7368 4.00982C23.7368 4.98021 22.9351 5.76792 21.9487 5.76792H14.1446C13.1569 5.76792 12.3551 4.98021 12.3551 4.00982C12.3551 3.04072 13.1569 2.25301 14.1446 2.25301H21.9487Z"
                fill="white"
              />
            </svg>
          </span>
        </div>

        {/* <span className="badge bg-secondary">
          {users?.length} {users?.length > 1 ? "Users" : "User"}
        </span> */}
      </div>

      <div
        className="d-flex p-2 justify-content-around sidebar-menu"
        style={{ backgroundColor: "#001420" }}
      >
        <div
          className={`menu-tab d-flex align-items-center ${
            activeTab === "recent" ? "active" : ""
          }`}
          onClick={() => setActiveTab("recent")}
        >
          <span style={{ height: "20px" }}></span>
          <span>Recent</span>
        </div>

        <div
          className={`menu-tab d-flex align-items-center gap-2 ${
            activeTab === "unread" ? "active" : ""
          }`}
          onClick={() => setActiveTab("unread")}
        >
          <span className="badge mt-0 bg-light text-dark chat-unread">
            {unreadCount}
          </span>{" "}
          <span>Unread</span>
        </div>
      </div>

      <div className="d-flex">
        <div className="small-sidebar d-none d-md-block">
          <NavigationBar
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        </div>

        <div className="chat-list-container chat-user-scroll">
          {users.length > 0 ? (
            <ul className="list-group list-group-flush">
              {users?.map((item) => (
                <li
                  key={item?._id}
                  className={`list-group-item clickable chat-item ${
                    item?._id === selectedChat.id ? "active" : ""
                  }`}
                  onClick={() => {
                    handleUserClick(item);
                  }}
                >
                  <div className="d-flex align-items-center">
                    <Image
                      src={item?.avatarUrl}
                      alt="avatar"
                      className="chat-avatar"
                      width={40}
                      height={40}
                    />

                    <div className="chat-info flex-grow-1">
                      <div className="d-flex align-items-start">
                        <div>
                          <p className="chat-name mb-0">{item?.name}</p>
                          <p
                            className={`chat-last-message mb-0 ${
                              item?.lastMessage?.isReadByAdmin ? "" : "fw-bold"
                            }`}
                          >
                            {item?.lastMessage?.fileType &&
                              (item.lastMessage.fileType.startsWith("image")
                                ? "Image"
                                : item.lastMessage.fileType.startsWith("video")
                                  ? "Video"
                                  : item.lastMessage.fileType.startsWith(
                                        "audio",
                                      )
                                    ? "Audio"
                                    : item.lastMessage.fileType ===
                                        "application/pdf"
                                      ? "Pdf"
                                      : "")}

                            {item?.lastMessage?.fileType &&
                              item?.lastMessage?.text?.trim() &&
                              "/"}

                            {item?.lastMessage?.text}
                          </p>
                        </div>
                        <div
                          className="ms-auto text-end"
                          style={{ minWidth: "60px" }}
                        >
                          <div>
                            <small className="chat-time">
                              <p className="mb-0">
                                {/* {getChatDayLabel(item?.lastMessage?.createdAt)} */}
                              </p>
                              <span>
                                {item?.lastMessage?.createdAt
                                  ? moment(item?.lastMessage?.createdAt).format(
                                      "hh:mm A",
                                    )
                                  : "--"}
                              </span>
                              <div className="d-flex justify-content-center">
                                {item?.unreadCount > 0 ? (
                                  <span className="badge bg-light text-dark chat-unread">
                                    {item?.unreadCount ? item?.unreadCount : ""}
                                  </span>
                                ) : (
                                  <div style={{ height: "20px" }}></div>
                                )}
                              </div>
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <div
                className="text-center d-flex flex-column justify-content-center align-items-center"
                style={{ height: "70vh" }}
              >
                <i
                  style={{ fontSize: "6rem" }}
                  className={`fa-solid ${emptyIcon} mb-3`}
                ></i>
                <h4 className="px-4">{emptyText}</h4>
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className="d-flex d-md-none justify-content-around 
                position-fixed bottom-0 start-0 w-100 py-2 shadow-lg down-menu-bar"
        style={{ zIndex: 1050, backgroundColor: "#1E1E1E" }}
      >
        <NavigationBar
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      </div>
    </div>
  );
}

export default ChatSideBar;
