import React, { lazy, Suspense } from "react";
import Section1 from "./Section1/Section1";
import Section2 from "./Section2/Section2";

// 🚀 Only lazy-load the heavy below-the-fold content (Sections 3-5)
// Section 2 is kept synchronous because it's visible on mobile immediately
const Section3 = lazy(() => import("./Section3/Section3"));
const Section4 = lazy(() => import("./Section4/Section4"));
const Section5 = lazy(() => import("./Section5/Section5"));

// ⚡ SectionLoader remains for below-the-fold content
const SectionLoader = () => (
	<div style={{
		minHeight: '200px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}}>
		<div style={{
			width: '32px',
			height: '32px',
			borderRadius: '50%',
			border: '3px solid #f3d8e8',
			borderTopColor: '#f299c2',
			animation: 'spin 1s linear infinite'
		}} />
		<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
	</div>
);

const Body = () => {
	return (
		<div className="main-home-body">
			<Section1 where="banner" />
			{/* Section 2 is visible immediately — no lazy loading */}
			<Section2 />

			{/* Sections 3-5 load in the background */}
			<Suspense fallback={<SectionLoader />}>
				<Section3 />
			</Suspense>
			<Suspense fallback={<SectionLoader />}>
				<Section4 />
			</Suspense>
			<Suspense fallback={<SectionLoader />}>
				<Section5 />
			</Suspense>
		</div>
	);
};

export default Body;
