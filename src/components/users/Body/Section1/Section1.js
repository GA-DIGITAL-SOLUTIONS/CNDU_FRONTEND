import React from "react";
import "./Section1.css";
import { useNavigate } from "react-router-dom";

const Section1 = () => {
	const navigate = useNavigate();
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
					<button onClick={()=>navigate('/collections')}>Shop collections</button>
				</div>
			</div>
		</div>
	);
};

export default Section1;
