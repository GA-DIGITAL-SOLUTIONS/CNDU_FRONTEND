import React from "react";
import "./OrderStatus.css";

const OrderStatus = ({ status }) => {
	const steps = ["pending", "shipped", "delivered"];

	const currentStep = steps.indexOf(status);

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
		</div>
	);
};

export default OrderStatus;
