import React from "react";
import { Card } from "antd";
import "./DashboardCard.css";

const DashboardCard = ({ title, subtitle, Icon }) => {
	return (
		<Card className="dashboard-card" bordered={false}>
			<div className="card-content">
				<div className="left-side">
					<h1>{title}</h1>
					<h5>{subtitle}</h5>
				</div>
				<div className="right-side">{Icon}</div>
			</div>
		</Card>
	);
};

export default DashboardCard;
