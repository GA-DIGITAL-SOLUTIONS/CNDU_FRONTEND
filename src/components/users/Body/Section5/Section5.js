import React, { useState } from "react";
import "./Section5.css";
import { Link } from "react-router-dom";
import Footer from "../../Footer/Footer";
import Heading from "../../Heading/Heading";



const Section5 = () => {
  const [expandedQuestions, setExpandedQuestions] = useState([
    false,
    false,
    false,
  ]);
  const toggleQuestion = (index) => {
    setExpandedQuestions((prevState) => {
      const newExpandedQuestions = [...prevState];
      newExpandedQuestions[index] = !newExpandedQuestions[index];
      return newExpandedQuestions;
    });
  };

  return (
    <div className="Section5-wholediv">
      <div className="sub-sec1">
        {/* <h1>What people all over the world are saying about us</h1>
        <img src="./Leaf.png" className="leafimg" alt="Leaf" /> */}
        <Heading>What people all over the world are saying about us</Heading>
        <div className="cards-container">
          <div className="card">
            <h1>Amazing Service</h1>
            <h2>5 Stars</h2>
            <p>I love using this product every day!</p>
          </div>
          <div className="card">
            <h1>Highly Recommend</h1>
            <h2>4.5 Stars</h2>
            <p>It has changed my workflow!</p>
          </div>
          <div className="card">
            <h1>Fantastic Support</h1>
            <h2>5 Stars</h2>
            <p>The team is so helpful!</p>
          </div>
        </div>

        <div className="arrows-container">
          <div className="Leftarrow-container">
            <img src="./Leftarrow.png" alt="Left Arrow" />
          </div>
          <div className="Rightarrow-container">
            <img src="./Rightarrow.png" alt="Right Arrow" />
          </div>
        </div>
      </div>

      <div className="sub-sec2">
        {/* <h1>Frequently asked questions</h1>
        <img src="./Leaf.png" alt="Right Arrow" /> */}
        <Heading>Frequently asked questions</Heading>
        <div className="cardandquestions-container">
          <div className="question-container">
            {[
              "What is your return policy?",
              "How do I track my order?",
              "Can I purchase a gift card?",
            ].map((question, index) => (
              <div className="question-box" key={index}>
                <div className="question-header">
                  <h3>{question}</h3>
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="toggle-button"
                  >
                    {expandedQuestions[index] ? "✕" : "+"}
                  </button>
                </div>
                {expandedQuestions[index] && (
                  <div className="question-content">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Fusce porttitor sem vel dolor vestibulum, et efficitur
                      lorem interdum.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="questions-card-container">
            {/* <FaStar className="card-icon" />  */}
            <img src="./Questionmarkicon.png" />
            <h3 className="card-title">Do you have more questions?</h3>
            <p className="card-text">
              Lorem ipsum dolor sit amet consectetur. Quam libero viverra
              faucibus condimentum.
            </p>
            <button className="card-button">Shoot a direct mail</button>
          </div>
        </div>
      </div>

      <div className="sub-sec3">
        <div className="sign-up-card">
          <h5>
            Sign up now. so your selected items are saved to your personal cart.
          </h5>
          <div className="input-container">
            <input
              type="email"
              placeholder="Enter your email"
              className="sign-up-input"
            />
            <button className="sign-up-button">Sign Up</button>
          </div>
        </div>
      </div>

      <div className="sub-sec4">
      </div>
    </div>
  );
};

export default Section5;




/* 
<div className="footer-container">
          <div className="row1">
            <div className="col1">
              <img src="./logo.png" className="logo-image" />
              <p>
                CNDU fabrics. Vestibulum non est nisl. Donec eget sodales nisl.
                Donec ut velit erat.
              </p>
            </div>
            <div className="col2">
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">Explore</span>
              </div>
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">Fabrics</span>
              </div>
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">CNDU collections</span>
              </div>
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">Products</span>
              </div>
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">Reviews</span>
              </div>
            </div>
            <div className="col3">
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">Cancellation Policy</span>
              </div>
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">Return Policy</span>
              </div>
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">Refund policy</span>
              </div>
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">Terms & Conditions</span>
              </div>
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">Disclaimer</span>
              </div>
            </div>

            <div className="col4">
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">9392372736</span>
              </div>
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">info@cndufabrics.condimentum</span>
              </div>
              <div className="logo-text-container">
                <img
                  src="./FooterFlower.png"
                  alt="Logo"
                  className="footerimg"
                />
                <span className="text">
                  CNDU Fabrics <br />
                </span>
              </div>
              <div className="footer-social-icons">
                <img src="./Fblogo.png"></img>
                <img src="./instalogo.png"></img>
                <img src="./youtubelogo.png"></img>
              </div>
            </div>
          </div>
          <div className="row2">
            <h4>Track your Shipment Here</h4>
            <div className="col1">
              <div className="inputbut-container">
                <input
                  className=""
                  type="text"
                  placeholder="Enter your Shipment I'd"
                />
                <button>Track</button>
              </div>
            </div>
          </div>
          <div className="row3">
            @2024 All right reserved | Design and Developed by{" "}
            <Link>
              <span>GA Digital Solutions</span>
            </Link>
          </div>
        </div>

*/