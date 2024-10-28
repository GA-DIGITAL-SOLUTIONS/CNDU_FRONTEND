import React from "react";
import animationData from "./loaderanimation.json";
import Lottie from "react-lottie";
import "./Loader.css";

const Loader = () => {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
	};
	return (
		<div className="loader-teacher">
			<Lottie
				isClickToPauseDisabled={true}
				className="loader-image"
				options={defaultOptions}
			/>
		</div>
	);
};

export default Loader;
