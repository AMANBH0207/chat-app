import NavigationBar from "./NavigationBar";

function ComingSoon({
  selectedMenu,
  setSelectedMenu,
}: {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
}) {

  return (
    <>
      <div className="flex-grow-1 chat-area d-flex flex-column">
        <div
          className="sideBarHeader justify-content-between align-items-center headersColor comingSoon-header"
          style={{ padding: "35px 10px" }}
        >
          <span className="logo-lg">
          </span>
        </div>
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
          <h5>This feature is Coming Soon</h5>
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
    </>
  );
}

export default ComingSoon;
