import React from "react";
import firstaniversarysale from "../bannerimages/firstaniversarysale.jpg";
import subpagebanner from "../bannerimages/subpagebanner.jpg";
import { useNavigate } from "react-router-dom";

export default function FirstAniversarySale({ where }) {
  const today = new Date();
  const navigate = useNavigate();

  // Define the start and end dates for the condition
  const startDate = new Date(today.getFullYear(), 8, 5, 0, 0, 0); // Sept 5, 00:00
  const endDate = new Date(today.getFullYear(), 8, 15, 23, 59, 59); // Sept 15, 23:59

  // Check if today is within the range
  const isBetween = today >= startDate && today <= endDate;

  // Decide which banner to show
  const bannerSrc = isBetween ? firstaniversarysale : "/HomePageBanner.jpg";

  const otherbannerSrc = isBetween ? subpagebanner : "./productpageBanner.png";

  return (
    <>
      {where === "banner" && (
        <>
          <img src={bannerSrc} alt="Banner" className="section1-image" />
          {!isBetween && (
            <div className="section-text">
              <div className="heading-text">
                Getting the best and <br /> latest style has never <br />
                <span>been easier!</span>
              </div>
              <div className="subtext-section">
                <span>CNDU FABRICS</span> is a platform that helps to make
                fashion accessible to all. It brings fashion to your doorstep!
              </div>
              {/* <div className="section-button">
              <button
                onClick={() => navigate("/offers")} //CNDUCollections
                style={{ cursor: "pointer" }}
              >
                Shop now
              </button>
            </div> */}
            </div>
          )}
        </>
      )}
      {where === "otherbanners" && (
        <img
          src={otherbannerSrc}
          className="productpageBanner"
          alt="Product Page Banner"
        />
      )}
    </>
  );
}
