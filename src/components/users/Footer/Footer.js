import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import Flowerlog from "./images/FooterFlower.png";
import cnduLogo from "./images/logo.png";
import instaLogo from "./images/instalogo.png";
import youtubelogo from "./images/youtubelogo.png";
import FBlogo from "./images/FBlogo.png";

const Footer = () => {
	return (
		<div className="footer_back">
			<div className="footer-container">
				<div className="row1">
					<div className="col1">
						<img src={cnduLogo} className="logo-image" alt="CNDU Logo" />
						<p>
							Step into a world of luxury with CNDU Fabrics. Our upcoming
							website offers an exclusive collection of women's apparel designed
							to inspire and empower.
						</p>
					</div>
					<div className="col2">
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="">Explore</Link>
							</span>
						</div>
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="fabrics">Fabrics</Link>
							</span>
						</div>
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="">CNDU collections</Link>
							</span>
						</div>
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="">Products</Link>
							</span>
						</div>
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="">Reviews</Link>
							</span>
						</div>
					</div>
					<div className="col3">
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="">Cancellation Policy</Link>
							</span>
						</div>
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="">Return Policy</Link>
							</span>
						</div>
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="">Refund Policy</Link>
							</span>
						</div>
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="">Terms & Conditions</Link>
							</span>
						</div>
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="">Disclaimer</Link>
							</span>
						</div>
					</div>

					<div className="col4">
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="">9392372736</Link>
							</span>
						</div>
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="">info@cndufabrics.condimentum</Link>
							</span>
						</div>
						<div className="logo-text-container">
							<img src={Flowerlog} alt="Logo" className="footerimg" />
							<span className="text">
								<Link to="">CNDU Fabrics</Link>
							</span>
						</div>
						<div className="footer-social-icons">
							<Link to="">
								<img src={youtubelogo} alt="YouTube Logo" />
							</Link>
							<Link to="">
								<img src={instaLogo} alt="Instagram Logo" />
							</Link>
							<Link to="">
								<img src={FBlogo} alt="Facebook Logo" />
							</Link>
						</div>
					</div>
				</div>
				<div className="row2">
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
					Copyright @2024 CNDU Fabrics - All right reserved | Design and
					Developed by{" "}
					<a href="www.gadigitalsolutions.com">
						<span>GA Digital Solutions</span>
					</a>
				</div>
			</div>
		</div>
	);
};

export default Footer;
