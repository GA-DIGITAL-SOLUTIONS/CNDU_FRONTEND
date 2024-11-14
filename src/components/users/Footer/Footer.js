import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import Flowerlog from './images/FooterFlower.png'
import cnduLogo from './images/logo.png'
import instaLogo from './images/instalogo.png'
import youtubelogo from './images/youtubelogo.png'
import FBlogo from './images/FBlogo.png'



const Footer = () => {
  return (
    <div className='footer_back'>
    <div className="footer-container">
    <div className="row1">
      <div className="col1">
        <img src={cnduLogo} className="logo-image" />
        <p>
          CNDU fabrics. Vestibulum non est nisl. Donec eget sodales nisl.
          Donec ut velit erat.
        </p>
      </div>
      <div className="col2">
        <div className="logo-text-container">
          <img
            src={Flowerlog}
            alt="Logo"
            className="footerimg"
          />
          <span className="text">Explore</span>
        </div>
        <div className="logo-text-container">
          <img
                src={Flowerlog}
           
            alt="Logo"
            className="footerimg"
          />
          <span className="text">Fabrics</span>
        </div>
        <div className="logo-text-container">
          <img
                src={Flowerlog}
            alt="Logo"
            className="footerimg"
          />
          <span className="text">CNDU collections</span>
        </div>
        <div className="logo-text-container">
          <img
                src={Flowerlog}
            alt="Logo"
            className="footerimg"
          />
          <span className="text">Products</span>
        </div>
        <div className="logo-text-container">
          <img
                src={Flowerlog}
            alt="Logo"
            className="footerimg"
          />
          <span className="text">Reviews</span>
        </div>
      </div>
      <div className="col3">
        <div className="logo-text-container">
          <img
                src={Flowerlog}
            alt="Logo"
            className="footerimg"
          />
          <span className="text">Cancellation Policy</span>
        </div>
        <div className="logo-text-container">
          <img
                src={Flowerlog}
            alt="Logo"
            className="footerimg"
          />
          <span className="text">Return Policy</span>
        </div>
        <div className="logo-text-container">
          <img
                src={Flowerlog}
            alt="Logo"
            className="footerimg"
          />
          <span className="text">Refund policy</span>
        </div>
        <div className="logo-text-container">
          <img
                src={Flowerlog}
            alt="Logo"
            className="footerimg"
          />
          <span className="text">Terms & Conditions</span>
        </div>
        <div className="logo-text-container">
          <img
                src={Flowerlog}
            alt="Logo"
            className="footerimg"
          />
          <span className="text">Disclaimer</span>
        </div>
      </div>

      <div className="col4">
        <div className="logo-text-container">
          <img
                src={Flowerlog}
            alt="Logo"
            className="footerimg"
          />
          <span className="text">9392372736</span>
        </div>
        <div className="logo-text-container">
          <img
                src={Flowerlog}
            alt="Logo"
            className="footerimg"
          />
          <span className="text">info@cndufabrics.condimentum</span>
        </div>
        <div className="logo-text-container">
          <img
                src={Flowerlog}
            alt="Logo"
            className="footerimg"
          />
          <span className="text">
            CNDU Fabrics <br />
          </span>
        </div>
        <div className="footer-social-icons">
          
          <img src={youtubelogo}></img>
          <img src={instaLogo}></img>
          <img src={FBlogo}></img>

          
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
  </div>
  )
}

export default Footer