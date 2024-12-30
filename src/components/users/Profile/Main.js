import React, { useState, useEffect } from "react";
import { Tabs, Grid } from "antd";
import AccountTab from "./AccountTab";
import "./style.css";
import Address from "./Address";
import LogoutTab from "./Logout";
import PasswordTab from "./PasswordTab";
import OrdersTab from "./OrdersTab";
import WishlistTab from "./WishlistTab";
import Returns from "./Returns";

const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const UserAccount = () => {
	const screens = useBreakpoint();
	const [tabPosition, setTabPosition] = useState("left");

	useEffect(() => {
		setTabPosition(screens.md ? "left" : "top");
	}, [screens]);

	return (
		<div className="user-account">
			<img
				alt="productbanner"
				src="./productpageBanner.png"
				className="banner"
			/>
			<div className="tabs-container">
				<Tabs
					defaultActiveKey="1"
					tabPosition={tabPosition}
					className="custom-tabs"
					tabBarGutter={16}
					type="line"
					tabBarStyle={{
						overflowX: "auto",
						whiteSpace: "nowrap", 
					}}>
					<TabPane tab="Account" key="1">
						<div className="tab-content">
							<AccountTab />
						</div>
					</TabPane>
					<TabPane tab="Password" key="2">
						<div className="tab-content">
							<PasswordTab />
						</div>
					</TabPane>
					<TabPane tab="Address" key="3">
						<div className="tab-content">
							<Address />
						</div>
					</TabPane>
					<TabPane tab="Orders" key="4">
						<div className="tab-content">
							<OrdersTab />
						</div>
					</TabPane>
					<TabPane tab="Returns" key="5">
						<div className="tab-content">
							<Returns />
						</div>
					</TabPane>
					<TabPane tab="Wishlist" key="6">
						<div className="tab-content">
							<WishlistTab />
						</div>
					</TabPane>
					<TabPane tab="Log Out" key="7">
						<div className="tab-content">
							<LogoutTab />
						</div>
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
};

export default UserAccount;
