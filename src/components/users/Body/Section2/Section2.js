import React, { useEffect, useState } from "react";
import "./Section2.css";
import Heading from "../../Heading/Heading";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Skeleton card shown while data is loading — prevents layout shift (CLS)
const SkeletonCard = () => (
	<div className="card skeleton-card">
		<div className="skeleton-img"></div>
		<div className="skeleton-text">
			<div className="skeleton-line skeleton-line-short"></div>
			<div className="skeleton-line skeleton-line-long"></div>
		</div>
	</div>
);

const Section2 = () => {
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
	}, []);

	// Show skeleton cards while loading to prevent CLS
	if (!newProducts) {
		return (
			<div className="total-section2">
				<div className="section2-container">
					<Heading>NEW ARRIVALS</Heading>
					<div className="cards-container">
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="total-section2">
			<div className="section2-container">
				<Heading>NEW ARRIVALS</Heading>

				<div className="cards-container">
					<div className="card">
						<Link to="/fabrics">
							<img
								src={`${apiurl}${newProducts?.fabric?.data?.product_colors?.[0]?.images?.[0]?.image}`}
								alt="Fabrics"
								className="cardimg"
								width="300"
								height="400"
								// PRIORITIZE the first cards for Speed Index
								fetchpriority="high"
							/>
							<div className="card-text">
								<div className="text-left">
									<h1>Fabrics</h1>
									<h4>Explore now!</h4>
								</div>
								<div className="arrow-right">&rarr;</div>
							</div>
						</Link>
					</div>
					<div className="card">
						<Link to="/sarees">
							<img
								src={`${apiurl}${newProducts?.dress?.data?.product_colors?.[0]?.images?.[0]?.image}`}
								alt="Sarees"
								className="cardimg"
								width="300"
								height="400"
								// PRIORITIZE the first cards for Speed Index
								fetchpriority="high"
							/>
							<div className="card-text">
								<div className="text-left">
									<h1>Sarees</h1>
									<h4>Explore now!</h4>
								</div>
								<div className="arrow-right">&rarr;</div>
							</div>
						</Link>
					</div>
					<div className="card">
						<Link to="/CNDUCollections">
							<img
								src={`${apiurl}${newProducts?.special_collection?.data?.product_colors?.[0]?.images?.[0]?.image}`}
								alt="CNDU Collections"
								className="cardimg"
								width="300"
								height="400"
								loading="lazy"
							/>
							<div className="card-text">
								<div className="text-left">
									<h1>CNDU Signature Collections</h1>
									<h4>Explore now!</h4>
								</div>
								<div className="arrow-right">&rarr;</div>
							</div>
						</Link>
					</div>
				</div>
				<button className="seeallbut">See all &rarr;</button>
			</div>
		</div>
	);
};

export default Section2;
