import React, { useEffect } from "react";
import "./Reviews.css";
import googlePlaces from "./google-maps-reviews";

export default function App() {
	useEffect(() => {
		googlePlaces(window.google, "google-reviews", {
			placeId: "ChIJyYTLEeqRyzsR4RzpgvE1T1Q",
		});
	}, []);

	return (
		<div className="App">
			<div id="google-reviews"></div>
		</div>
	);
}
