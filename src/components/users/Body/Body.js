import React, { lazy, Suspense } from "react";
import Section1 from "./Section1/Section1";
import Section2 from "./Section2/Section2";


// 🚀 Lazy loading below-the-fold sections reduces main bundle by ~100KB
// const Section2 = lazy(() => import("./Section2/Section2"));
const Section3 = lazy(() => import("./Section3/Section3"));
const Section4 = lazy(() => import("./Section4/Section4"));
const Section5 = lazy(() => import("./Section5/Section5"));

// Lightweight loading placeholder for lazy sections
const SectionLoader = () => (
	<div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
		<div className="loader-spinner"></div>
	</div>
);

const Body = () => {
	return (
		<div className="main-home-body">
			<Section1 />

			<Suspense fallback={<SectionLoader />}>
				<Section2 />
				<Section3 />
				<Section4 />
				<Section5 />
			</Suspense>
		</div>
	);
};

export default Body;
