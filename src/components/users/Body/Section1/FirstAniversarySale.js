import React from "react";
import { useSelector } from "react-redux";
import YearEndSale from "../bannerimages/YearEndSale.jpeg";
import { useNavigate } from "react-router-dom";

// bannerimage.jpeg is served from /public directly as fallback
const BANNER_FALLBACK = process.env.PUBLIC_URL + "/bannerimage.jpeg";

export default function FirstAniversarySale({ where }) {
  const today = new Date();
  const navigate = useNavigate();
  const { apiurl } = useSelector((store) => store.auth);

  const startDate = new Date(today.getFullYear(), 11, 20, 0, 0, 0);
  const endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
  const isBetween = today >= startDate && today <= endDate;

  // Use optimization service if available, else fallback
  // Note: For this to work, bannerimage.jpeg MUST be copied to CNDU_BACKEND/images/banners/
  const getOptimizedUrl = (path, width) => {
    if (!apiurl) return process.env.PUBLIC_URL + "/" + path;
    return `${apiurl}/api/optimize-image/?path=banners/${path}&w=${width}&q=75`;
  };

  // Fallback to local public folder to ensure visibility while testing
  // Optimized WebP via backend proxy is best for production once images are migrated
  const bannerSrc = isBetween ? YearEndSale : BANNER_FALLBACK;
  const mobileBannerSrc = process.env.PUBLIC_URL + "/bannerimage_mobile.jpeg";

  return (
    <>
      {where === "banner" && (
        <>
          <div className="sale-banner">
            <picture>
              {/* 🚀 Mobile Optimization: Load a separate mobile banner JPEG */}
              <source
                media="(max-width: 767px)"
                srcSet={mobileBannerSrc}
              />
              <img
                src={bannerSrc}
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
