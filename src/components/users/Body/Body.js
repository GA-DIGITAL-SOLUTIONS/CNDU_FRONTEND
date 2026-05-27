import React, { lazy, Suspense, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Section1 from "./Section1/Section1";
import Section2 from "./Section2/Section2";
import HomeSkeleton from "./HomeSkeleton";

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
	const { apiurl } = useSelector((state) => state.auth);
	const [newProducts, setNewProducts] = useState(null);

	useEffect(() => {
		fetch(`${apiurl}/homepage/data/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => setNewProducts(data))
			.catch((error) => console.error("Error fetching data:", error));
	}, [apiurl]);

	// Show unified full-page skeleton while loading
	if (!newProducts) {
		return <HomeSkeleton />;
	}

	return (
		<div className="main-home-body">
			<Section1 where="banner" />
			{/* Section 2 is visible immediately — no lazy loading */}
			<Section2 newProducts={newProducts} />

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
