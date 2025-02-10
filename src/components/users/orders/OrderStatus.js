import React, { useEffect } from "react";
import "./OrderStatus.css";
import { useNavigate } from "react-router-dom";

const OrderStatus = ({ orderStatus = "N/A", trackingDetails = [] , orderNumber = 'N/A' }) => {
	const steps = ["Shipped","Out for Deivery", "Delivered", "Cancelled", "Returned"];
	const navigate = useNavigate();
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
			<div className="tracking-details">
				<div className="complete-order-btn">
					<button  onClick={()=>{navigate(`/trackOrder/${orderNumber}`)}}>View Tracking Details </button>
				</div>
				{/* <div className="progress-bar">
					{steps.map((step, index) => (
						<div
							key={index}
							className={`progress-step ${index <= currentStep ? "completed" : ""
								}`}>
							<span>{step}</span>
						</div>
					))}
				</div> */}

				
{/* 
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
				)} */}
			</div>
		</div>
	);
};

export default OrderStatus;
