import React, { useEffect, useState } from "react";
import { Alert } from "antd";

export default function PromoBanner() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update the current time every minute
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000); // every 1 min

    return () => clearInterval(timer);
  }, []);

  const startDate = new Date(2025, 8, 5, 0, 0, 0);
  const endDate = new Date(2025, 8, 15, 23, 59, 59);

  const isInRange = now >= startDate && now <= endDate;

  if (!isInRange) return null;

  return (
    <Alert
      message="✨ Special Offer: For every ₹2000 spent, you will receive 1 Silver Coin (1g)"
      banner
      showIcon={false}
      style={{
        minHeight: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f24c88",
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        padding: "8px 12px",
        fontSize: "clamp(12px, 2vw, 16px)",
        lineHeight: "1.4",
        wordBreak: "break-word",
      }}
    />
  );
}
