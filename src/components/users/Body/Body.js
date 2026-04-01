// src/components/Body/Body.js
import React from "react";
import Section1 from "./Section1/Section1";
import Section2 from "./Section2/Section2";
import Section3 from "./Section3/Section3";
import Section4 from "./Section4/Section4";
import Section5 from "./Section5/Section5";

const Body = () => {
	return (
		<div className="main-home-body">
			<Section1 />

			<Section2 />

			<Section3 />

			<Section4 />

			<Section5 />
		</div>
	);
};

export default Body;
