import React from "react";
import "./Section3.css";
import { useNavigate } from "react-router-dom";
const Section3 = () => {
	const navigate = useNavigate();
	return (
		<div
			className="section3-container"
			onClick={() => navigate("/CNDUCollections")}>
			<img
				src="./trendyStyles.png"
				className="TrendySectionimg"
				alt="CNDU Trendy Style Collections"
				width="1200"
				height="400"
				loading="lazy"
			/>
		</div>
	);
};

export default Section3;
