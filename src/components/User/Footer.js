import React from "react";
import {
	FacebookFilled,
	TwitterSquareFilled,
	LinkedinFilled,
	InstagramFilled,
} from "@ant-design/icons";
import logo from "./../../images/logo.svg";

const FooterComponent = () => {
	return (
		<footer className="footer">
			<div className="footer-top">
				<div className="footer-content">
					<div className="footer-left">
						<img src={logo} alt="Storyland Logo" className="logo" />
						<p className="footer-description">
							Discover the magic of reading at Story Land Library & Activity
							Center, where every visit is a new adventure. We invite you to
							explore our diverse collection of books and engaging activities.
							Join us in creating joyful and memorable reading experiences for
							the whole family. Explore more about our activities and offerings
							at our library.
						</p>
						<div className="social-media">
							<a
								href="https://www.facebook.com/profile.php?id=61565883520236"
								target="_blank"
								rel="noopener noreferrer"
								className="social-icon">
								<FacebookFilled />
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="social-icon">
								<TwitterSquareFilled />
							</a>
							<a
								href="https://www.instagram.com/storylandhyd/"
								target="_blank"
								rel="noopener noreferrer"
								className="social-icon">
								<InstagramFilled />
							</a>
						</div>
					</div>
					<div className="footer-middle">
						<h4>Quick Links</h4>
						<ul className="quick-links">
							<li>
								<a href="/">Home</a>
							</li>
							<li>
								<a href="/#aboutus">About Us</a>
							</li>
							<li>
								<a href="/catalogue">Catalogue</a>
							</li>
							<li>
								<a href="/activities">Activities</a>
							</li>
							<li>
								<a href="/profile">My Account</a>
							</li>
							<li>
								<a href="/subscriptions">Subscription Plans</a>
							</li>
						</ul>
					</div>
					<div className="footer-right">
						<h4>Contact</h4>
						<p>Phone: +91 9000331561</p>
						<p>Email: storylandhyd@gmail.com</p>
						<p>Address</p>
						<p>
							8-1-328/D Shaikpet, Kathiani Garden, Opposite Aditya Empress
							Towers, Hyderabad Telangana 500008
						</p>
					</div>
					<div className="newsletter">
						<h4>Subscribe to our Newsletter!</h4>
						<p>Be the first to receive exclusive offers and updates.</p>
						<form>
							<input type="email" placeholder="Enter your email address" />
							<button type="submit">Subscribe Now</button>
						</form>
					</div>
				</div>
				<div>
					<ul className="terms-contiditons-links">
						<li>
							<a href="/termsandconditions">Terms and Conditions</a>
						</li>
						<li>
							<a href="/privacypolicy">Privacy Policy</a>
						</li>
						<li>
							<a href="/cancellationpolicy">
								Refunds, Cancellations and Pricing
							</a>
						</li>
					</ul>
				</div>
			</div>

			<div className="footer-bottom">
				<p className="copyright">
					Copyright © 2024, <span>Story Land Library</span> - All Rights
					Reserved.
				</p>
				<p className="gads">
					Designed and Developed by{" "}
					<a
						href="https://gadigitalsolutions.com"
						target="_blank"
						rel="noopener noreferrer">
						GA Digital Solutions
					</a>
				</p>
			</div>
		</footer>
	);
};

export default FooterComponent;
