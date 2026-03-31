import React from "react";
import firstaniversarysale from "../bannerimages/firstaniversarysale.jpg";
import YearEndSale from "../bannerimages/YearEndSale.jpeg";
import subpagebanner from "../bannerimages/subpagebanner.jpg";
import { useNavigate } from "react-router-dom";
import bannerimage from '../bannerimages/bannerimage.jpeg'

export default function FirstAniversarySale({ where }) {
  const today = new Date();
  const navigate = useNavigate();

  const startDate = new Date(today.getFullYear(), 11, 20, 0, 0, 0);
  const endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
  const isBetween = today >= startDate && today <= endDate;

  const bannerSrc = isBetween ? YearEndSale : bannerimage;
  const otherbannerSrc = "./productpageBanner.png";

  return (
    <>
      {where === "banner" && (
        <>
          <div className="sale-banner">
            {/* Priority 1: fetchpriority=high tells browser to load this image FIRST */}
            {/* This directly fixes the 18.6s mobile LCP */}
            <img
              src={bannerSrc}
              alt="CNDU Fabrics — Shop sarees, fabrics & blouses online"
              className="sale-banner__image"
              width="1200"
              height="450"
              fetchpriority="high"
              loading="eager"
              decoding="async"
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
          src={otherbannerSrc}
          className="productpageBanner"
          alt="Product Page Banner"
          width="1200"
          height="200"
          loading="lazy"
        />
      )}
    </>
  );
}
