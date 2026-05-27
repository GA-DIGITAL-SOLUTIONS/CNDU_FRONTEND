import React from "react";
import "./HomeSkeleton.css";

const HomeSkeleton = () => {
  return (
    <div className="home-skeleton-container">
      {/* Banner Placeholder */}
      <div className="skeleton-base skeleton-banner"></div>

      {/* Section 2 (New Arrivals) Placeholder */}
      <div style={{ marginTop: "20px" }}>
        <div className="skeleton-base skeleton-section-title"></div>
        <div className="skeleton-cards-row" style={{ marginTop: "30px" }}>
          <div className="skeleton-base skeleton-card"></div>
          <div className="skeleton-base skeleton-card"></div>
          <div className="skeleton-base skeleton-card"></div>
        </div>
      </div>

      {/* Section 3/4 Placeholder */}
      <div style={{ marginTop: "40px" }}>
        <div className="skeleton-base skeleton-section-title"></div>
        <div className="skeleton-cards-row" style={{ marginTop: "30px" }}>
          <div className="skeleton-base skeleton-card" style={{ height: "250px", width: "45%" }}></div>
          <div className="skeleton-base skeleton-card" style={{ height: "250px", width: "45%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
