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

  // ✅ Dec 19 (00:00:00) to Dec 31 (23:59:59)
  const year = new Date().getFullYear();
  const startDate = new Date(year, 11, 20, 0, 0, 0);   // Dec 19
  const endDate = new Date(year, 11, 31, 23, 59, 59); // Dec 31 night
  
  const isInRange = now >= startDate && now <= endDate;

  if (!isInRange) return null;

  return (
    <Alert
      message="✨ Year End Sale is Live! Get Up to 80% OFF | 20–31 Dec ✨"
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
