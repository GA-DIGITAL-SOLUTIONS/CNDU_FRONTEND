import React, { useState } from "react";
import "./Specialdealscard.css";
import { useNavigate } from "react-router-dom";

const Specialdealscard = () => {
	const [email, setEmail] = useState("");
	const Navigate = useNavigate();
	const handleSubscribe = () => {
		if (email) {
			Navigate("/signup");
			console.log("Entered Email:", email);
		} else {
			console.log("Please enter a valid email.");
		}
	};

	return (
		<div className="Specialdealscard_container">
			<div className="row1">
				<h1>Join our newsletter for Special Deals & Offers</h1>
				<p>
					Register now to get the latest updates on promotions & coupons.{" "}
					<br></br>Don't worry, we won't spam!
				</p>
			</div>
			<div className="row2">
				<input
					type="email"
					placeholder="Enter your Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<button onClick={handleSubscribe}>Subscribe</button>
			</div>
		</div>
	);
};

export default Specialdealscard;
