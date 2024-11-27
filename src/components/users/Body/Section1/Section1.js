import React from "react";
import "./Section1.css";

const Section1 = () => {
	return (
		<div className="section1">
			<img src="/HomePageBanner.jpg" alt="Banner" className="section1-image" />
			<div className="section-text">
				<div className="heading-text">
					Getting the best and <br /> latest style has never <br />
					<span>been easier!</span>
				</div>
				<div className="subtext-section">
					<span>CNDU FABRICS</span> is a platform that helps to make fashion
					accessible to all. It brings fashion to your doorstep!
				</div>
				<div className="section-button">
					<button>Shop collections</button>
				</div>
			</div>
		</div>
	);
};

export default Section1;
