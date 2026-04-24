"use client";

import Image from "next/image";
import "../ChatBot.css";

export default function AppLoader() {
  return (
    <div className="loader-wrapper">
      <div className="orbit-box">
        <div className="orbit-ring"></div>

        <Image
          src="/assets/images/logo/app_logo_noname.png"
          alt="Conversa"
          width={90}
          height={90}
          className="logo"
        />
      </div>

      {/* <p className="loading-text">Loading...</p> */}

      <div className="dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}