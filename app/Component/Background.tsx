import React from "react";

const Background = () => {
  return (
    <div
      className="fixed inset-0 w-full h-full opacity-6 pointer-events-none"
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, rgb(128, 128, 128) 0px, rgb(128, 128, 128) 2px, transparent 2px, transparent 40px),
          repeating-linear-gradient(90deg, rgb(128, 128, 128) 0px, rgb(128, 128, 128) 2px, transparent 2px, transparent 40px)
        `,
        backgroundSize: "40px 40px",
        zIndex: -1
      }}
    />
  );
};

export default Background;