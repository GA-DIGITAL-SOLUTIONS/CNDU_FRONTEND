import React from "react";
import { Card } from "antd";
import "./DashboardCard.css";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ title, subtitle, Icon }) => {
	const Navigate=useNavigate()

	const handleCardRoute=()=>{
		if(subtitle==="Products"){
		Navigate("/inventory")
	}else if(subtitle==="Total Orders"){
		Navigate("/adminorders")
	}else if(subtitle==="Pending Orders"){
		Navigate("/adminorders")
	}
}

	return (
		<Card className="dashboard-card" bordered={false} onClick={handleCardRoute} style={{cursor:"pointer"}}>
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
