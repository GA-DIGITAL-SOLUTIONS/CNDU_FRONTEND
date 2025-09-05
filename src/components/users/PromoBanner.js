import React from "react";
import { Alert } from "antd";

export default function PromoBanner() {
  return (
    <Alert
      message="✨ Special Offer: For every ₹2000 spent, you will receive 1 Silver Coin (1g)"
      banner
      showIcon={false}
      style={{
        minHeight: "40px", // keeps it compact but flexible
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f24c88",
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        padding: "8px 12px", // responsive friendly padding
        fontSize: "clamp(12px, 2vw, 16px)", // responsive text size
        lineHeight: "1.4",
        wordBreak: "break-word",
      }}
    />
  );
}
