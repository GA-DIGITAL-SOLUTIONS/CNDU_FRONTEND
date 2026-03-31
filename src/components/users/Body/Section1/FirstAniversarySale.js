import React from "react";
import YearEndSale from "../bannerimages/YearEndSale.jpeg";
import { useNavigate } from "react-router-dom";

// bannerimage.jpeg is served from /public directly (NOT bundled in JS)
// This allows the browser to discover and load it immediately — fixes LCP
const BANNER_URL = process.env.PUBLIC_URL + "/bannerimage.jpeg";

export default function FirstAniversarySale({ where }) {
  const today = new Date();
  const navigate = useNavigate();

  const startDate = new Date(today.getFullYear(), 11, 20, 0, 0, 0);
  const endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
  const isBetween = today >= startDate && today <= endDate;

  // Use YearEndSale during Dec 20–31, otherwise use public banner
  const bannerSrc = isBetween ? YearEndSale : BANNER_URL;

  return (
    <>
      {where === "banner" && (
        <>
          <div className="sale-banner">
            <picture>
              {/* If a mobile-specific image exists, use it for screens under 768px */}
              <source
                media="(max-width: 767px)"
                srcSet={process.env.PUBLIC_URL + "/bannerimage_mobile.jpeg"}
              />
              <img
                src={bannerSrc}
                alt="CNDU Fabrics — Shop sarees and fabrics"
                className="sale-banner__image"
                // fetchpriority="high" — load this FIRST
                fetchpriority="high"
                // Explicit dimensions prevent CLS
                width="1200"
                height="600"
                // Do NOT lazy-load the LCP image
                loading="eager"
              />
            </picture>
            {isBetween && (
              <button className="sale-banner__cta">SHOP NOW</button>
            )}
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
              <div className="section-button" style={{ display: "none" }}>
                <button
                  onClick={() => navigate("/offers")}
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
          src="./productpageBanner.png"
          className="productpageBanner"
          alt="Product Page Banner"
          width="1200"
          height="300"
          loading="lazy"
        />
      )}
    </>
  );
}
