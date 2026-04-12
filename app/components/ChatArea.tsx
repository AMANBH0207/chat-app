import React, { useEffect, useState, useMemo } from "react";
import ChatInput from "./ChatInput";
import moment from "moment";
import FilePreview from "./FilePreview";
import { fetchMessages } from "../store/Messages/messagesThunks";
import { useAppDispatch } from "../store/hooks";

interface SelectedChatType {
  id: string | null;
  name: string | null;
  room_id: string | null;
}

interface ChatAreaProps {
  selectedChat: SelectedChatType;
  setSelectedChat: (c: SelectedChatType) => void;
}

function ChatArea({ selectedChat, setSelectedChat }: ChatAreaProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<any[] | undefined>([]);
  const [fromApi, setFromApi] = useState(false);
  const [matchIndexes, setMatchIndexes] = useState<number[]>([]);
  const [activeMatch, setActiveMatch] = useState(0);
  const messageRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const dates = useMemo(() => {
    const displayMsgs = fromApi
      ? [...(messages || [])].reverse()
      : messages || [];
    return displayMsgs.map((msg) => msg?.createdAt.split("T")[0]);
  }, [messages, fromApi]);

  const displayMessages = useMemo(() => {
    return fromApi ? [...(messages || [])].reverse() : messages || [];
  }, [messages, fromApi]);

  useEffect(() => {
    if (showSearch) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    } else {
    }
  }, [showSearch]);

  useEffect(() => {
    if (selectedChat?.room_id) {
      dispatch(fetchMessages(selectedChat?.room_id)).then((res)=>{
        setMessages(res.payload)
      });
    }
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!messageSearch.trim()) {
      scrollToBottom();
    }
  }, [messages, messageSearch]);

  const forceDownload = async (url: string, fileName = "image") => {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  useEffect(() => {
    if (!matchIndexes.length) return;

    const idx = matchIndexes[activeMatch];

    requestAnimationFrame(() => {
      const node = messageRefs.current[idx];
      node?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [activeMatch, matchIndexes]);

  useEffect(() => {
    messageRefs.current = [];
  }, [displayMessages]);

  return (
    <div
      className={`flex-grow-1 chat-area d-flex flex-column ${
        selectedChat?.id ? "show-mobile" : "hide-mobile"
      }`}
    >
      {/* Chat Header */}
      <div
        className="d-flex align-items-center justify-content-between areaheader border-bottom headersColor"
        style={{ padding: "12px 10px" }}
      >
        {/* LEFT SIDE */}
        <div className="d-flex align-items-center">
          {/* Mobile Back Button */}
          <div className="d-md-none me-2">
            <span
              className="p-2"
              onClick={() =>
                setSelectedChat({ name: null, id: null, room_id: null })
              }
            >
              <svg
                width="10"
                height="17"
                viewBox="0 0 10 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.32292 16.8831C8.10992 16.8837 7.89946 16.8439 7.70701 16.7667C7.51456 16.6895 7.34501 16.5768 7.21082 16.4369L0.324346 9.20195C0.114641 8.98619 0 8.71555 0 8.43625C0 8.15695 0.114641 7.88632 0.324346 7.67055L7.4532 0.435607C7.69521 0.189357 8.04297 0.0345001 8.41998 0.00510245C8.79699 -0.0242952 9.17237 0.0741747 9.46354 0.27885C9.7547 0.483525 9.93781 0.777639 9.97257 1.09649C10.0073 1.41534 9.8909 1.73281 9.64889 1.97906L3.27569 8.44228L9.43502 14.9055C9.60937 15.0825 9.72012 15.298 9.75416 15.5266C9.78821 15.7552 9.74413 15.9872 9.62714 16.1952C9.51015 16.4033 9.32514 16.5786 9.09401 16.7005C8.86287 16.8224 8.59529 16.8857 8.32292 16.8831Z"
                  fill="white"
                />
              </svg>
            </span>
          </div>

          {/* Avatar */}

          {/* Chat Name */}
          <h5 className="fw-bold mb-0 ms-2">{selectedChat?.name}</h5>
        </div>

        {/* RIGHT SIDE ICON */}
        <div>
          <button
            className="btn rounded-pill no-focus"
            onClick={() => setShowSearch(!showSearch)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.6386 19.9036L17.4844 15.7616C18.8247 14.054 19.552 11.9454 19.5493 9.77463C19.5493 7.84139 18.976 5.95157 17.9019 4.34414C16.8279 2.73671 15.3013 1.48387 13.5152 0.744054C11.7291 0.00423515 9.76379 -0.189335 7.8677 0.187821C5.9716 0.564977 4.22993 1.49592 2.86293 2.86293C1.49592 4.22993 0.564977 5.9716 0.187821 7.8677C-0.189335 9.76379 0.00423515 11.7291 0.744054 13.5152C1.48387 15.3013 2.73671 16.8279 4.34414 17.9019C5.95157 18.976 7.84139 19.5493 9.77463 19.5493C11.9454 19.552 14.054 18.8247 15.7616 17.4844L19.9036 21.6386C20.0172 21.7531 20.1523 21.844 20.3012 21.906C20.4501 21.9681 20.6098 22 20.7711 22C20.9324 22 21.0921 21.9681 21.241 21.906C21.3899 21.844 21.525 21.7531 21.6386 21.6386C21.7531 21.525 21.844 21.3899 21.906 21.241C21.9681 21.0921 22 20.9324 22 20.7711C22 20.6098 21.9681 20.4501 21.906 20.3012C21.844 20.1523 21.7531 20.0172 21.6386 19.9036ZM2.44366 9.77463C2.44366 8.3247 2.87361 6.90733 3.67915 5.70176C4.48469 4.49619 5.62963 3.55656 6.96919 3.0017C8.30875 2.44683 9.78276 2.30166 11.2048 2.58452C12.6269 2.86739 13.9332 3.5656 14.9584 4.59085C15.9837 5.61611 16.6819 6.92236 16.9647 8.34443C17.2476 9.7665 17.1024 11.2405 16.5476 12.5801C15.9927 13.9196 15.0531 15.0646 13.8475 15.8701C12.6419 16.6756 11.2246 17.1056 9.77463 17.1056C7.83034 17.1056 5.96568 16.3332 4.59085 14.9584C3.21603 13.5836 2.44366 11.7189 2.44366 9.77463Z"
                fill="white"
              />
            </svg>
          </button>
          <button className="btn rounded-pill no-focus">
            <svg
              width="5"
              height="23"
              viewBox="0 0 5 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.2359 4.46153C1.7947 4.46254 1.3631 4.3327 0.995689 4.08843C0.628279 3.84415 0.341556 3.49641 0.171778 3.08918C0.00199955 2.68195 -0.0432081 2.23352 0.0418717 1.8006C0.126951 1.36767 0.338498 0.969699 0.649758 0.657004C0.961019 0.344309 1.35801 0.130936 1.79054 0.0438666C2.22307 -0.0432028 2.6717 -5.7386e-05 3.07971 0.167847C3.48772 0.335751 3.83677 0.620873 4.08273 0.987156C4.3287 1.35344 4.46052 1.78443 4.46153 2.22564C4.46223 2.81707 4.22829 3.38463 3.81105 3.8038C3.39381 4.22296 2.82733 4.4595 2.2359 4.46153ZM4.50256 20.0717C4.50155 19.6305 4.36972 19.1995 4.12376 18.8333C3.8778 18.467 3.52874 18.1819 3.12074 18.014C2.71273 17.846 2.2641 17.8029 1.83157 17.89C1.39904 17.977 1.00205 18.1904 0.690786 18.5031C0.379526 18.8158 0.167979 19.2138 0.0828997 19.6467C-0.0021801 20.0796 0.0430275 20.5281 0.212806 20.9353C0.382584 21.3425 0.669307 21.6903 1.03672 21.9345C1.40413 22.1788 1.83572 22.3086 2.27693 22.3076C2.86836 22.3056 3.43483 22.0691 3.85208 21.6499C4.26932 21.2307 4.50326 20.6632 4.50256 20.0717ZM4.48205 11.1487C4.48103 10.7075 4.34921 10.2765 4.10325 9.91021C3.85728 9.54393 3.50823 9.2588 3.10022 9.0909C2.69222 8.92299 2.24358 8.87985 1.81106 8.96692C1.37853 9.05399 0.981533 9.26736 0.670272 9.58006C0.359012 9.89275 0.147465 10.2907 0.0623857 10.7236C-0.0226941 11.1566 0.0225135 11.605 0.192292 12.0122C0.36207 12.4195 0.648793 12.7672 1.0162 13.0115C1.38361 13.2558 1.81521 13.3856 2.25641 13.3846C2.84784 13.3826 3.41432 13.146 3.83156 12.7268C4.24881 12.3077 4.48274 11.7401 4.48205 11.1487Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* SEARCH BOX — SHOW ONLY WHEN TOGGLED */}
      {showSearch && (
        <div className="message-search">
          <div className="py-2">
            <div className="input-group input-group-sm">
              {/* Search Icon */}
              <span
                className="input-group-text border-end-0 rounded-start-pill"
                style={{ border: "none" }}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>

              <input
                ref={searchInputRef}
                type="text"
                className="form-control rounded-end-pill border-start-0"
                placeholder="Search Message..."
                style={{ height: "30px", color: "#6c757d" }}
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
              />

              {matchIndexes.length > 0 && (
                <div className="d-flex align-items-center gap-2 ms-2">
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() =>
                      setActiveMatch((p) =>
                        p > 0 ? p - 1 : matchIndexes.length - 1,
                      )
                    }
                  >
                    ↑
                  </button>

                  <span className="small">
                    {activeMatch + 1}/{matchIndexes.length}
                  </span>

                  <button
                    className="btn btn-sm btn-light"
                    onClick={() =>
                      setActiveMatch((p) => (p + 1) % matchIndexes.length)
                    }
                  >
                    ↓
                  </button>
                </div>
              )}
              {messageSearch && (
                <button
                  className="btn btn-sm rounded-circle btn-light ms-1"
                  style={{ marginTop: "3px", width: "30px", height: "30px" }}
                  onClick={() => {
                    setMessageSearch("");
                    setMatchIndexes([]);
                    setActiveMatch(0);
                    searchInputRef.current?.focus();
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      {selectedChat?.id && (
        <>
          <div
            className="chat-messages flex-grow-1 px-3"
            style={{
              backgroundImage: "url(/assets/images/chat/chatbg-dark.png)",
              backgroundSize: "cover",
              backgroundRepeat: "repeat",
            }}
          >
            {displayMessages.map((item, idx) => (
              <React.Fragment key={item?._id}>
                {(idx === 0 || dates[idx] !== dates[idx - 1]) && (
                  <div
                    className="chat-message bot-message text-center my-4"
                    key={idx}
                  >
                    <div className="message-date d-inline-block">
                      {moment(dates[idx]).format("DD-MM-YYYY")}
                    </div>
                  </div>
                )}
                <div
                  ref={(el) => {
                    messageRefs.current[idx] = el;
                  }}
                  className={`chat-message ${
                    item?.sentBy === "User"
                      ? "bot-message text-start"
                      : "user-message text-end"
                  }`}
                >
                  <div
                    className={`message ${
                      item?.sentBy === "User"
                        ? "bg-light"
                        : "bg-primary text-white"
                    } d-inline-block rounded-3 p-2`}
                  >
                    {item.fileUrl ? (
                      <div className="clickable">
                        <FilePreview
                          fileType={item.fileType}
                          fileUrl={item.fileUrl}
                          fileName={item.fileName}
                          onImageClick={(url) => setPreviewImage(url)}
                          text={item?.text}
                        />
                      </div>
                    ) : (
                      <>
                        {!messageSearch.trim() ? (
                          <span>{item?.text}</span>
                        ) : (
                          item.text
                            .split(new RegExp(`(${messageSearch})`, "gi"))
                            .map((part: any, i: number) =>
                              part.toLowerCase() ===
                              messageSearch.toLowerCase() ? (
                                <mark
                                  key={i}
                                  className="bg-warning px-1 rounded"
                                >
                                  {part}
                                </mark>
                              ) : (
                                <span key={i}>{part}</span>
                              ),
                            )
                        )}
                      </>
                    )}
                  </div>
                  <div className="small text-muted mt-1 mr-2">
                    <span className="chat-time">
                      {moment(item?.createdAt).format("hh:mm A")}
                    </span>{" "}
                    {item?.sentBy === "Admin" && (
                      <i
                        className={`fa-solid fa-check-double ${
                          item?.isReadByUser ? "text-success" : "chat-time"
                        }`}
                      ></i>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput selectedChat={selectedChat} />
        </>
      )}

      {previewImage && (
        <div className="image-modal" onClick={() => setPreviewImage(null)}>
          {/* TOP BUTTONS WRAPPER */}
          <div className="modal-top-buttons">
            {/* Download Button */}
            <button
              className="modal-download-btn"
              onClick={(e) => {
                e.stopPropagation();
                forceDownload(previewImage, "downloaded_image");
              }}
            >
              <i className="fa-solid fa-arrow-right fa-rotate-90"></i>
            </button>

            {/* Close Button */}
            <button
              className="modal-close-btn "
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImage(null);
              }}
            >
              ✕
            </button>
          </div>

          <img src={previewImage} className="modal-image" />
        </div>
      )}
    </div>
  );
}

export default ChatArea;
