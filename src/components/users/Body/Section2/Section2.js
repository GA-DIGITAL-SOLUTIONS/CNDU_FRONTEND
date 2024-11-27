import React from "react";
import "./Section2.css";
import Heading from "../../Heading/Heading";
import { Link } from "react-router-dom";
const Section2 = () => {
	return (
		<div className="total-section2">
			<div className="section2-container">
				<Heading>NEW ARRIVALS</Heading>

				<div className="cards-container">
					<div className="card">
						<img src="./cardPic.png" alt="Fabrics" className="cardimg" />
						<div className="card-text">
							<div className="text-left">
								<h1>Fabrics</h1>
								<h4>Explore now!</h4>
							</div>
							<Link to="/fabrics">
								<div className="arrow-right">&rarr;</div>
							</Link>
						</div>
					</div>
					<div className="card">
						<img
							src="./new_arrival_sarees.png"
							alt="Sarees"
							className="cardimg"
						/>
						<div className="card-text">
							<div className="text-left">
								<h1>Sarees</h1>
								<h4>Explore now!</h4>
							</div>
							<Link to="/products">
								<div className="arrow-right">&rarr;</div>
							</Link>
						</div>
					</div>
					<div className="card">
						<img
							src="./new_arrival_cndu_specials.png"
							alt="CNDU Collections"
							className="cardimg"
						/>
						<div className="card-text">
							<div className="text-left">
								<h1>CNDU Signature Collections</h1>
								<h4>Explore now!</h4>
							</div>
							<Link to="/collections">
								<div className="arrow-right">&rarr;</div>
							</Link>
						</div>
					</div>
				</div>
				<button className="seeallbut">See all &rarr;</button>
			</div>
		</div>
	);
};

export default Section2;
