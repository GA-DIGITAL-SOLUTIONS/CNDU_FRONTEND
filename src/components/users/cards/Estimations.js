import React, { useState } from "react";

const FetchCostEstimates = () => {
	const host = "https://carrierv2-dev.shift.in";
	const authToken = "Q25kdWZhYnJpY3NAZ21haWwuY29tOk1hYW52aWthQDIzMTA=";
	const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
	const [shippingCharges, setShippingCharges] = useState(0);
	const [currentPin, setCurrentPin] = useState(null);
	const [error, setError] = useState("");

	const fetchCostEstimates = async () => {
		const url = `${host}/api/v1/open/cost-estimates/`;
		const headers = {
			"Content-Type": "application/json",
			Authorization: `Basic ${authToken}`,
			siteCode: "CARRIER",
		};

		const body = JSON.stringify({
			returnOrder: false,
			codOrder: true,
			destinationPin: currentPin,
			originPin: 500039,
			weightInGrams: 250,
			declaredValue: 1000,
			packageLength: 10,
			packageBreadth: 10,
			packageHeight: 10,
		});

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: body,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			const estimate = data?.data?.[0];

			if (estimate) {
				setEstimatedDeliveryDate(estimate.estimatedDeliveryDate);
				setShippingCharges(estimate.totalChargesBreakup.shippingCharges);
			}
		} catch (error) {
			setError(`Error fetching cost estimates: ${error.message}`);
		}
	};

	return (
		<div>
			<input onChange={(e) => setCurrentPin(e.target.value)}></input>
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
