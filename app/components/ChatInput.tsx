import React, { useRef } from "react";
import AttachmentPopup from "./AttachmentPopup";
import { useAppDispatch } from "../store/hooks";
import { socket } from "../socket";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { sendUserMessage } from "../store/Messages/messagesThunks";

interface SelectedChatType {
  id: string | null;
  name: string | null;
  room_id: string | null;
}

interface ChatInputProps {
  selectedChat: SelectedChatType;
}

function ChatInput({ selectedChat }: ChatInputProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordTime, setRecordTime] = React.useState(0); // seconds
  const [audioURL, setAudioURL] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState("");
  const [showAttachment, setShowAttachment] = React.useState(false);
  const [filePreview, setFilePreview] = React.useState<{
    type: "image" | "pdf" | "video" | "zip" | null;
    url: string | null;
    name: string | null;
  }>({
    type: null,
    url: null,
    name: null,
  });
  const [isOverflow, setIsOverflow] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isTyping, setIsTyping] = React.useState(false);
  const typingTimeoutRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };
  React.useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [message]);
  const sendMessage = () => {
    if (!selectedChat?.room_id) return;

    if (selectedFile) {
      dispatch(
        sendUserMessage({
          roomId: selectedChat.room_id,
          file: selectedFile,
          text: message,
        }),
      );

      setSelectedFile(null);
      setFilePreview({ type: null, url: null, name: null });
      setMessage("");
      return;
    }

    if (audioFile) {
      dispatch(
        sendUserMessage({
          roomId: selectedChat.room_id,
          file: audioFile,
        }),
      );
      setAudioFile(null);
      setAudioURL(null);
      audioChunksRef.current = [];
      return;
    }

    if (!message.trim()) return;

    socket.emit("send_message", {
      roomId: selectedChat.room_id,
      text: message,
      senderId: user?._id,
    });

    setMessage("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("video") && file.size > 20 * 1024 * 1024) {
      alert("Video size cannot exceed 20MB.");
      return;
    }
    const isImage = file.type.startsWith("image");
    const isVideo = file.type.startsWith("video");
    const isPdf = file.type === "application/pdf";
    const isZip =
      file.type === "application/zip" ||
      file.type === "application/x-zip-compressed" ||
      file.name.toLowerCase().endsWith(".zip");

    let previewURL = null;

    if (isImage) {
      previewURL = URL.createObjectURL(file);
    }
    setSelectedFile(file);

    setFilePreview({
      type: isImage
        ? "image"
        : isVideo
          ? "video"
          : isPdf
            ? "pdf"
            : isZip
              ? "zip"
              : null,
      url: previewURL,
      name: file.name,
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        const file = new File(audioChunksRef.current, "audio.webm", {
          type: "audio/webm",
        });

        setAudioFile(file);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordTime(0);

      // timer starts
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => {
          if (prev >= 30) {
            stopRecording(); // auto-stop
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error: any) {
      alert("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        sendMessage();
      }
    }
  };

  const handleTyping = (value: string) => {
  setMessage(value);

  if (!selectedChat?.room_id) return;

  if (!isTyping) {
    setIsTyping(true);

    socket.emit("typing_start", {
      roomId: selectedChat.room_id,
      userId: user?._id,
    });
  }

  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }

  typingTimeoutRef.current = setTimeout(() => {
    socket.emit("typing_stop", {
      roomId: selectedChat.room_id,
      userId: user?._id,
    });

    setIsTyping(false);
  }, 1000);
};

  

  return (
    <>
      <div className="chat-input border-top py-3 px-2 headersColor">
        {isRecording && (
          <div
            className="d-flex align-items-center mb-2 p-2 rounded"
            style={{
              background: "#e4ffe4",
              border: "1px solid #c6f5c6",
            }}
          >
            <div className="wave-container me-3">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>

            <strong className="filesname">{formatTime(recordTime)}</strong>
            <span className="text-muted ms-2">Recording...</span>
          </div>
        )}

        {audioURL && !isRecording && (
          <div
            className="mb-2 p-2 rounded d-flex align-items-center justify-content-between"
            style={{
              background: "#f6f7f8",
              border: "1px solid #e3e3e3",
            }}
          >
            <audio controls src={audioURL} style={{ width: "85%" }} />
            <button
              className="btn btn-sm btn-light border-0"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "10px",
              }}
              onClick={() => {
                setAudioURL(null);
                audioChunksRef.current = [];
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {filePreview.type && (
          <div
            className="d-flex align-items-center mb-2 p-2 rounded position-relative"
            style={{
              background: "#f6f7f8",
              border: "1px solid #e3e3e3",
            }}
          >
            {filePreview.type === "image" && (
              <img
                src={filePreview.url!}
                alt="preview"
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "5px",
                  objectFit: "cover",
                  marginRight: "10px",
                }}
              />
            )}

            {filePreview.type === "pdf" && (
              <i className="fa-solid fa-file-pdf text-danger fs-3 me-2"></i>
            )}

            {filePreview.type === "video" && (
              <i className="fa-solid fa-video text-primary fs-3 me-2"></i>
            )}
            {filePreview.type === "zip" && (
              <i className="fa-solid fa-file-zipper text-warning fs-3 me-2"></i>
            )}

            <div className="flex-grow-1">
              <span className="filesname">{filePreview.name}</span>
            </div>

            <button
              className="btn btn-sm btn-light border-0"
              onClick={() => {
                setFilePreview({ type: null, url: null, name: null });
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
        <div className="d-flex align-items-end">
          <button
            className="btn rounded-pill me-2 btn-custom-dark"
            onClick={() => setShowAttachment(true)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>

          <input
            type="file"
            accept="image/*,video/*,.pdf,.zip,application/zip,application/x-zip-compressed"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <div className="flex-grow-1">
            <div
              className={`d-flex align-items-center px-3 chatBot-Input ${
                isOverflow ? "rounded" : "rounded-pill"
              }`}
            >
              <textarea
                className="chat-text-area"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setIsOverflow(e.target.scrollHeight > 120);
                  handleTyping(e.target.value)
                }}
                onKeyDown={handleKeyPress}
                rows={1}
                placeholder="Type your message..."
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  overflowY: "auto",
                  maxHeight: "120px",
                  background: "transparent",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                }}
              ></textarea>
            </div>
          </div>

          {!isRecording &&
          !audioURL &&
          message.trim() === "" &&
          !filePreview.type ? (
            <button
              className="btn rounded-pill ms-2 btn-custom-dark"
              onClick={startRecording}
            >
              <i className="fa-solid fa-microphone"></i>
            </button>
          ) : isRecording ? (
            <button
              className="btn btn-danger rounded-pill ms-2 no-focus-btn"
              onClick={stopRecording}
            >
              <i className="fa-solid fa-stop"></i>
            </button>
          ) : (
            <button
              className="btn btn-custom-dark rounded-pill ms-2 "
              onClick={sendMessage}
            >
              <i className="fa fa-paper-plane"></i>
            </button>
          )}
        </div>
      </div>

      <AttachmentPopup
        open={showAttachment}
        onClose={() => setShowAttachment(false)}
        onSelect={(type) => {
          setShowAttachment(false);

          const input = fileInputRef.current!;
          if (!input) return;

          if (type === "gallery") {
            input.accept = "image/*";
            input.removeAttribute("capture");
            input.click();
          }

          if (type === "document") {
            input.accept = "*/*";
            input.removeAttribute("capture");
            input.click();
          }

          if (type === "camera") {
            const input = fileInputRef.current!;
            input.accept = "image/*";
            input.setAttribute("capture", "environment");
            input.click();
          }

          if (type === "record") {
            startRecording();
          }

          if (type === "location") {
            navigator.geolocation.getCurrentPosition((pos) => {
              const msg = `My location: https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
              setMessage(msg);
            });
          }
        }}
      />
    </>
  );
}

export default ChatInput;
