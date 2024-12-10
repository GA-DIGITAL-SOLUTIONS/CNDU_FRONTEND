import { Button, message } from "antd";
import React, { useState } from "react";
import "./Estimations.css";

const FetchCostEstimates = ({ productId }) => {
	const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
	const [currentPin, setCurrentPin] = useState("");
	const [loading, setLoading] = useState(false);
	const apiurl = process.env.REACT_APP_API_URL;

	const fetchCostEstimates = async () => {
		setLoading(true);
		const url = `${apiurl}/fetch-time-estimates/`;
		const headers = {
			"Content-Type": "application/json",
		};

		const body = {
			currentPin: currentPin,
			productId: productId,
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(body),
			});

			const data = await response.json();

			if (!response.ok) {
				message.error(`HTTP error! Status: ${response.status}`);
			}

			if (data.error) {
				message.error(data.error);
			} else {
				setEstimatedDeliveryDate(data.estimatedDeliveryDate);
			}
		} catch (error) {
			message.error(`Error fetching cost estimates: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fetch-estimates-container">
			<h3>Estimated Delivery</h3>
			<div className="fetch-estimates-input">
				<input
					type="text"
					placeholder="Enter your pin code"
					className="fetch-estimates-input-field"
					onChange={(e) => setCurrentPin(e.target.value)}
				/>
				<Button loading={loading} className="fetch-estimates-button" onClick={fetchCostEstimates}>
					Apply
				</Button>
			</div>
			<div className="fetch-estimates-info">
				{estimatedDeliveryDate && (
					<div className="fetch-estimates-results">
						<p className="fetch-estimates-delivery-date">
							Estimated Delivery Date: {estimatedDeliveryDate}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default FetchCostEstimates;
