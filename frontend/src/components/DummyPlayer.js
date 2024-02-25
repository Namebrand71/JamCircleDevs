import React, { useState, useEffect } from "react";

const DummyPlayer = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center", // Changed to center the children horizontally
        height: "150px", // Full height of the viewport
        width: "100%", // Width of the sidebar
        position: "fixed", // Fixed position
        left: "0", // Align to the left side of the viewport
        bottom: "0", // Align to the bottom of the viewport
        backgroundColor: "#111111", // Background color of the sidebar
        color: "white",
        padding: "20px", // Padding inside the sidebar
        boxSizing: "border-box", // Ensures padding doesn't affect the set width
      }}
    >
      <h1>Hello World lkajsdlkja slkdjlaksjdl aksjd lkasjdl kasjld kjasld k</h1>
    </div>
  );
};

export default DummyPlayer;
