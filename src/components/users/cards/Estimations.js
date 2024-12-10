import React, { useState } from "react";

const FetchCostEstimates = () => {
	const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
	const [shippingCharges, setShippingCharges] = useState(0);
	const [currentPin, setCurrentPin] = useState("");
	const [error, setError] = useState("");

	const fetchCostEstimates = async () => {
		const url = "http://localhost:8000/fetch-cost-estimates/";
		const headers = {
			"Content-Type": "application/json",
		};

		const body = {
			currentPin: currentPin,
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();

			if (data.error) {
				setError(data.error);
			} else {
				setEstimatedDeliveryDate(data.estimatedDeliveryDate);
				setShippingCharges(data.shippingCharges);
			}
		} catch (error) {
			setError(`Error fetching cost estimates: ${error.message}`);
		}
	};

	return (
		<div>
			<input
				type="text"
				placeholder="Enter your pin code"
				onChange={(e) => setCurrentPin(e.target.value)}
			/>
			<button onClick={fetchCostEstimates}>
				Get Current Location & Fetch Cost Estimates
			</button>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<div>
				<p>Current Location Pin: {currentPin}</p>
				<p>Estimated Delivery Date: {estimatedDeliveryDate}</p>
				<p>Shipping Charges: ₹{shippingCharges}</p>
			</div>
		</div>
	);
};

export default FetchCostEstimates;
