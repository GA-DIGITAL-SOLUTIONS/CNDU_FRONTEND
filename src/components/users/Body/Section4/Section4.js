import React from "react";
import "./Section4.css";
import Heading from "../../Heading/Heading";

const Section4 = () => {
	return (
		<div className="section4-container">
			<Heading>WHAT WE DO</Heading>
			<div className="Whatwedo-Cards">
				<div className="card">
					<img
						src="./Whatwedologo1.svg"
						alt="Logo 1"
						className="whatwedologo"
					/>
					<div className="card-content">
						<h3>Fabrics</h3>
						<p>
							Our fabrics are designed to inspire creativity, offering a wide
							range of options like ethnic, fancy, plain, printed, and
							theme-based designs. With in-house manufacturing, we ensure
							top-notch quality and exclusive patterns that stand out.{" "}
						</p>
					</div>
				</div>

				<div className="card">
					<img
						src="./Whatwedologo2.svg"
						alt="Logo 2"
						className="whatwedologo"
					/>
					<div className="card-content">
						<h3>Sarees</h3>
						<p>
							Our sarees blend tradition and modernity, featuring ethnic and
							fancy styles perfect for any occasion. From festive specials to
							daily elegance, each saree is crafted with care to celebrate
							individuality.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section4;
