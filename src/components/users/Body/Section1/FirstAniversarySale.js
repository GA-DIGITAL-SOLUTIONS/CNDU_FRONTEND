import React from "react";
import firstaniversarysale from "../bannerimages/firstaniversarysale.jpg";
import YearEndSale from "../bannerimages/YearEndSale.jpeg";
import subpagebanner from "../bannerimages/subpagebanner.jpg";
import { useNavigate } from "react-router-dom";

export default function FirstAniversarySale({ where }) {
  const today = new Date();
  const navigate = useNavigate();

  // Define the start and end dates for the condition
  // Define the start and end dates for the condition
  const startDate = new Date(today.getFullYear(), 11, 20, 0, 0, 0); // Dec 20, 00:00
  const endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59); // Dec 31, 23:59

  // Check if today is within the range
  const isBetween = today >= startDate && today <= endDate;

  // Decide which banner to show
  const bannerSrc = isBetween ? YearEndSale : "/HomePageBanner.jpg";

  const otherbannerSrc = isBetween
    ? "./productpageBanner.png"
    : "./productpageBanner.png";

  return (
    <>
      {where === "banner" && (
        <>
          <div className="sale-banner">
            <img
              src={bannerSrc}
              alt="Sale Banner"
              className="sale-banner__image"
            />
            {isBetween && (<button className="sale-banner__cta">SHOP NOW</button>)}
            
          </div>

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
              <div className="section-button" style={{display:"none"}}>
                <button
                  onClick={() => navigate("/offers")} //CNDUCollections
                  style={{ cursor: "pointer" }}
                >
                  Shop now
                </button>
              </div>
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
