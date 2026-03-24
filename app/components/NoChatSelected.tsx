import React from "react";

function NoChatSelected() {

  return (
    <>
      <div className="flex-grow-1 chat-area d-flex flex-column">
        <div
          style={{
            backgroundImage: "url(/assets/images/chat/chatbg-dark.png)",
            backgroundSize: "cover",
            backgroundRepeat: "repeat",
            width: "100%",
            height: "100%",
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="text-center">
            <i className="fa-solid fa-comments" style={{ fontSize: "6rem", padding:"1rem"}}></i>
            <h5>Select A User To Chat</h5>
          </div>
        </div>

        <div
          className="d-flex d-md-none justify-content-around 
                position-fixed bottom-0 start-0 w-100 py-2 shadow-lg down-menu-bar"
          style={{ zIndex: 1050, backgroundColor: "#1E1E1E" }}
        ></div>
      </div>
    </>
  );
}

export default NoChatSelected;
