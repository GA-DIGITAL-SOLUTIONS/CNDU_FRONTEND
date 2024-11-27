import React from "react";
import { Tabs, Button } from "antd";
import AccountTab from "./AccountTab";
import "./style.css";
import Address from "./Address";
import LogoutTab from "./Logout";

const { TabPane } = Tabs;

const PasswordTab = () => {
	return <div>Password Tab</div>;
};

const OrdersTab = () => {
	return <div>Orders Details Component</div>;
};

const WishlistTab = () => {
	return <div>Wishlist Details Component</div>;
};

const NotificationsTab = () => {
	return <div>Notifications Component</div>;
};

const UserAccount = () => {
	return (
		<div className="user-account">
			<img
				alt="productbanner"
				src="./productpageBanner.png"
				className="banner"
			/>
			<div className="tabs-container">
				<Tabs defaultActiveKey="1" tabPosition="left" className="custom-tabs">
					<TabPane tab="Account" key="1">
						<AccountTab />
					</TabPane>
					<TabPane tab="Password" key="2">
						<PasswordTab />
					</TabPane>
					<TabPane tab="Address" key="3">
						<Address />
					</TabPane>
					<TabPane tab="Orders" key="4">
						<OrdersTab />
					</TabPane>
					<TabPane tab="Wishlist" key="5">
						<WishlistTab />
					</TabPane>
					<TabPane tab="Notifications" key="6">
						<NotificationsTab />
					</TabPane>
					<TabPane tab="Log Out" key="7">
						<LogoutTab />
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
};

export default UserAccount;
