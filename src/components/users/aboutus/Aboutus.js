import React from "react";
import familyimg from "./images/image.png";
import familyimg2 from "./images/familyimg2.png";

import "./Aboutus.css";
import exclusive from "./images/exclusive.png";
import bestprice from "./images/bestprice.png";
import own from "./images/own.png";
import friendly from "./images/friendly.png";

const Aboutus = () => {
  return (
    <>
      <div className="about-page-container">
        <div className="image-content">
          <img src={familyimg} className="about-image-1" />
          <div className="about-content">
            <h1>ABOUT CNDU FABRICS</h1>
            <h3 className="imagesidetext">
              CNDU Fabrics began its journey in 2019 with a passion for making
              designer fabrics accessible to all. What started as free fashion
              designing classes quickly evolved into a fully-fledged fabric
              brand known for its unique designs, exceptional quality, and
              customer-first approach. With just a modest investment of ₹5000,
              we embarked on our mission to provide distinctive fabrics at
              affordable prices, and within a few short years, CNDU has gained
              the trust of thousands of customers across India.
            </h3>
          </div>
        </div>

        <h3>
          Our commitment to quality and originality has set us apart from other
          fabric suppliers. At CNDU, we design and manufacture our own fabrics,
          ensuring that every piece meets the highest standards of
          craftsmanship. Our fabrics and sarees are carefully curated to be
          unlike anything you'll find in the market—truly unique and
          fashion-forward, offering the perfect blend of tradition and
          modernity.
          <br />
          <br />
          In September 2024, we achieved a significant milestone by opening our
          first offline store in Gajularamaram, near Kukatpally, Hyderabad. This
          store is the first step in our broader vision to bring CNDU Fabrics to
          more people, expanding our reach across multiple cities and even
          internationally. Our goal is simple: to offer high-quality, exclusive
          fabrics at prices everyone can afford, without compromising on style
          or craftsmanship.
          <br />
          <br />
          At CNDU, we believe in giving back to the community. Our YouTube
          channel, CNDU Designer Studios, offers a free, comprehensive fashion
          designing course that would otherwise cost lakhs to learn at fashion
          institutes. This is our way of supporting aspiring designers and
          helping them hone their skills, further cementing our brand as a
          pioneer in accessible fashion education.
          <br />
          <br />
          Whether you're looking for ethnic fabrics, trendy prints, or elegant
          sarees, CNDU Fabrics is your one-stop destination. Our commitment to
          quality, affordability, and customer satisfaction is the cornerstone
          of our success, and we’re excited to continue growing and serving our
          customers with the very best in designer fabrics.
          <br />
          <br />
        </h3>

        <h1 className="heading">What Sets Us Apart</h1>

        <div className="what-sets-part-card">
          <div className="first-row-container">
            <div className="sets-card">
              <img src={exclusive} />
              <div className="head-text">
                <h2>Exclusive Designs</h2>
                <h4>
                  Our fabrics and sarees are uniquely crafted, unlike anything
                  else in the market.
                </h4>
              </div>
            </div>
            <div className="sets-card">
              <img src={bestprice} />
              <div className="head-text">
                <h2>Best Prices</h2>
                <h4>Affordable yet premium quality</h4>
              </div>
            </div>
          </div>
          <hr
            style={{
              margin: "20px auto",
              border: "1px solid #ddd",
              width: "80%",
            }}
          />
          <div className="first-row-container">
            <div className="sets-card">
              <img src={own} />
              <div className="head-text">
                <h2>Own Manufacturing</h2>
                <h4>Ensuring quality control and originality.</h4>
              </div>
            </div>
            <div className="sets-card">
              <img src={friendly} />
              <div className="head-text">
                <h2>Customer-Friendly Services</h2>
                <h4>
                  We provide a seamless shopping experience across India and
                  globally.
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="image-content" >
          <img src={familyimg2} className="about-image-1" />
          <div className="about-content">
            <h1>Vision, Mission, & Values</h1>
            <h2>Vision</h2>
            <h3 className="imagesidetext">
              Vision To become the leading global brand for designer fabrics,
              offering exclusivity and affordability while preserving
              traditional craftsmanship.
            </h3>
            <h2>Mission</h2>
            <h3 className="imagesidetext">
              To deliver high-quality, unique designer fabrics and sarees that
              inspire creativity and self-expression, ensuring our customers
              experience both luxury and value.
            </h3>
            <h2>Values</h2>
            <h3 >
              Customer First: Prioritizing customer satisfaction in every
              interaction.
              <br/>
              Innovation: Constantly evolving our designs to stay ahead of
              trends.
              <br/>
              Integrity: Upholding transparency and quality in all our
              processes.
              <br/>
              Sustainability: Ethical practices in sourcing and production.
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Aboutus;
