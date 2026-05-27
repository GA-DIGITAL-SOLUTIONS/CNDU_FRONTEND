import React, { useEffect, useState } from "react";
import "./Section2.css";
import Heading from "../../Heading/Heading";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const Section2 = ({ newProducts }) => {
	const { apiurl } = useSelector((state) => state.auth);

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
