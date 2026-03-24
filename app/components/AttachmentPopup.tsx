import React, { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (
    type: "camera" | "record" | "contact" | "gallery" | "location" | "document"
  ) => void;
}

const AttachmentPopup: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const [render, setRender] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setRender(true);

      // 🔥 allow one paint frame before enabling animation
      requestAnimationFrame(() => {
        setAnimate(true);
      });
    } else {
      setAnimate(false);

      const timer = setTimeout(() => {
        setRender(false);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!render) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 2000,
          opacity: animate ? 1 : 0,
          transition: "opacity 250ms ease",
        }}
      />

      {/* Popup */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: "90px",
          width: "90%",
          maxWidth: "360px",
          background: "#e5e5e5",
          borderRadius: "18px",
          padding: "20px",
          zIndex: 2001,

          transform: animate ? "translate(-50%, 0)" : "translate(-50%, 40px)",
          opacity: animate ? 1 : 0,
          transition: "all 250ms cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div className="row text-center g-3">
          {[
            ["camera", "Camera", "fa-camera"],
            ["record", "Record", "fa-microphone"],
            ["contact", "Contact", "fa-user"],
            ["gallery", "Gallery", "fa-image"],
            ["location", "My Location", "fa-location-dot"],
            ["document", "Document", "fa-file"],
          ].map(([type, label, icon]) => (
            <div key={type} className="col-4">
              <button
                className="btn rounded-circle mb-2"
                style={{
                  background: "#ffc107",
                  width: "55px",
                  height: "55px",
                }}
                onClick={() => onSelect(type as any)}
              >
                <i className={`fa-solid ${icon}`}></i>
              </button>
              <div style={{ fontSize: "13px", color:"#000000" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AttachmentPopup;
