import React from "react";
import { Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./DashboardCard.css"; // Custom CSS file

const DashboardCard = ({ title, subtitle, Icon }) => {// make this dynamic 
  return (
    <Card className="dashboard-card" bordered={false}
    bodyStyle={{ padding: "0px" }} >
      <div className="card-content">
        {/* Left Side Content */}
        <div className="left-side">
          {/* here h1 is dynamic  */}
          <h1>{title}950 </h1>
          <h5>{subtitle}Some subtitle </h5>
        </div>
        {/* Right Side with Icon */}
        <div className="right-side">
          {/* this icon is also dynamic different differnt  */}
          
          <img src={Icon}/>
        </div>
      </div>
    </Card>
  );
};

export default DashboardCard;
