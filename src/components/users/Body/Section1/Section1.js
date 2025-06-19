import React from "react";
import "./Section1.css";
import { useNavigate } from "react-router-dom";
import { Carousel, message } from "antd";
// import cnduashadamsale from '../bannerimages/cnduashadamsale.jpg'
import ashadam2 from '../bannerimages/ashadam2.jpg'
import cnduashadamsale from "../bannerimages/cnduashadamsale.jpg"
import cnduashadamsale3 from '../bannerimages/cnduashadamsale3.jpg'

const Section1 = () => {
  const navigate = useNavigate();

  const handleNavigate =()=>{
    navigate("/offers");
  }

  return (
    <>
      <div className="section1" onClick={handleNavigate}>
        <img
          // src="/HomePageBanner.jpg"
          src={cnduashadamsale3}
          alt="Banner"
          className="section1-image"
        />
        <div className="section-text">
          {/* <div className="heading-text">
            Getting the best and <br /> latest style has never <br />
            <span>been easier!</span>
          </div>
          <div className="subtext-section">
            <span>CNDU FABRICS</span> is a platform that helps to make fashion
            accessible to all. It brings fashion to your doorstep!
          </div> */}
          <div className="section-button">
            <button
              onClick={() => navigate("/offers")}//CNDUCollections
              style={{ cursor: "pointer" }}
            >
              Shop now
            </button>
          </div>
        </div>
      </div>
			{/*  */}
      {/* <div style={{ width: "100%"}}>
        <Carousel autoplay={true} effect="scrollx" infinite>
          <div className="home-banner">
            <img src={ashadam2}alt="SHEagle Trading" />
            <div className="bannercontent">
              <span>NEW IN</span>STUDIO COLLECTION
            </div>
          </div>
        </Carousel>
      </div> */}
    </>
  );
};

export default Section1;






