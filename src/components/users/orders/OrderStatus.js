import React from "react";
import "./OrderStatus.css";

const OrderStatus = ({ orderStatus = "N/A", trackingDetails = [] }) => {
	const steps = ["Ordered", "Shipped", "Out for Delivery", "Delivered"];

	const currentStep =
		steps.indexOf(orderStatus) !== -1 ? steps.indexOf(orderStatus) : 0;

	const formatDate = (date) => {
		if (!date) return "N/A";
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="order-status-container">
			<div className="progress-bar">
				{steps.map((step, index) => (
					<div
						key={index}
						className={`progress-step ${
							index <= currentStep ? "completed" : ""
						}`}>
						<span>{step}</span>
					</div>
				))}
			</div>

			<div className="tracking-details">
				<h3>Tracking Details</h3>
				{trackingDetails.length > 0 ? (
					<ul>
						{trackingDetails.map((detail, index) => (
							<li key={index}>
								<p>
									<strong>Status:</strong> {detail.scanStatus || "N/A"}
								</p>
								<p>
									<strong>Location:</strong> {detail.scanLocation || "N/A"}
								</p>
								<p>
									<strong>Date & Time:</strong>{" "}
									{formatDate(detail.scanDateTime)}
								</p>
							</li>
						))}
					</ul>
				) : (
					<p>
						No tracking details available at present. Live Tracking will start
						when the item is shipped.
					</p>
				)}
			</div>
		</div>
	);
};

export default OrderStatus;
