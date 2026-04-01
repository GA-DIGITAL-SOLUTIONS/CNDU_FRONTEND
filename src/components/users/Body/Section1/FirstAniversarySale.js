import React from "react";
import { useSelector } from "react-redux";
import YearEndSale from "../bannerimages/YearEndSale.jpeg";
import { useNavigate } from "react-router-dom";

// bannerimage.jpeg is served from /public directly as fallback
const BANNER_WEBP = "/bannerimage.webp";
const BANNER_FALLBACK = "/bannerimage.jpeg";
const MOBILE_BANNER_WEBP = "/bannerimage_mobile.webp";
const MOBILE_BANNER_FALLBACK = "/bannerimage_mobile.jpeg";

export default function FirstAniversarySale({ where }) {
  const today = new Date();
  const navigate = useNavigate();
  const { apiurl } = useSelector((store) => store.auth);

  const startDate = new Date(today.getFullYear(), 11, 20, 0, 0, 0);
  const endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
  const isBetween = today >= startDate && today <= endDate;

  // Use optimization service if available, else fallback
  const getOptimizedUrl = (path, width) => {
    // If apiurl is missing or localhost, use local fallback to ensure banner is never "gone"
    if (!apiurl || apiurl.includes("localhost") || apiurl.includes("127.0.0.1")) {
      return "/" + path;
    }
    return `${apiurl}/api/optimize-image/?path=banners/${path}&w=${width}&q=75`;
  };

  const bannerSrc = isBetween
    ? YearEndSale
    : getOptimizedUrl("bannerimage.jpeg", 1200);
  const mobileBannerSrc = getOptimizedUrl("bannerimage_mobile.jpeg", 600);

  return (
    <>
      {where === "banner" && (
        <>
          <div className="sale-banner">
            <picture>
              {/* 🚀 Mobile Optimization: Load the new .webp version for instant paint! */}
              <source
                media="(max-width: 767px)"
                srcSet={MOBILE_BANNER_WEBP}
                type="image/webp"
              />
              {/* Fallback mobile source if webp is somehow unsupported */}
              <source
                media="(max-width: 767px)"
                srcSet={mobileBannerSrc}
              />
              <img
                src={BANNER_WEBP}
                onError={(e) => {
                  // 🛡️ CRITICAL FALLBACK: If webp is missing, instantly switch back to JPEG
                  if (!e.target.dataset.fallbackApplied) {
                    e.target.src = BANNER_FALLBACK;
                    e.target.dataset.fallbackApplied = true;
                  }
                }}
                alt="CNDU Fabrics — Shop sarees and fabrics"
                className="sale-banner__image"
                fetchpriority="high"
                width="1200"
                height="400"
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
          src="/productpageBanner.webp"
          className="productpageBanner"
          alt="Product Page Banner"
          width="1200"
          height="300"
          loading="lazy"
          onError={(e) => {
            if (!e.target.dataset.fallbackApplied) {
              e.target.src = "/productpageBanner.png";
              e.target.dataset.fallbackApplied = true;
            }
          }}
        />
      )}
    </>
  );
}
