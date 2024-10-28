import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
	MenuOutlined,
	UserOutlined,
	ShoppingCartOutlined,
	HeartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Drawer, Button } from "antd";
import "./Layout.css";
import logo from "./../../images/logo.png";
import FooterComponent from "./Footer";

const { Header, Footer } = Layout;

const Main = ({ children }) => {
	const location = useLocation();
	const [openKeys, setOpenKeys] = useState([]);
	const [drawerVisible, setDrawerVisible] = useState(false);

	const defaultSelectedKeys = () => {
		const pathname = location.pathname;

		const menuItems = [
			"/catalogue",
			"/activities",
			"/subscriptions",
			"/cart",
			"/wishlist",
			"/profile",
		];

		const index = menuItems.findIndex((item) => pathname.includes(item));
		return index !== -1 ? [`${index + 2}`] : ["1"];
	};

	const showDrawer = () => {
		setDrawerVisible(true);
	};

	const onClose = () => {
		setDrawerVisible(false);
	};

	const menuItems = [
		{
			key: "1",
			label: <Link to="/">Home</Link>,
		},
		{
			key: "2",
			label: <Link to="/catalogue">Catalogue</Link>,
		},
		{
			key: "3",
			label: <Link to="/activities">Activities</Link>,
		},
		{
			key: "4",
			label: <Link to="/subscriptions">Subscription Plans</Link>,
		},
		{
			key: "5",
			icon: <ShoppingCartOutlined />,
			label: <Link to="/cart">Cart</Link>,
		},
		{
			key: "6",
			icon: <HeartOutlined />,
			label: <Link to="/wishlist">WishList</Link>,
		},
		{
			key: "7",
			icon: <UserOutlined />,
			label: <Link to="/profile">My Account</Link>,
		},
	];

	return (
		<Layout>
			<Header className="user-layout-head">
				<div className="user-layout-header-logo">
					<a href="/">
						<img alt="logo" src={logo}></img>
					</a>
				</div>
				<Button
					className="user-layout-mobile-menu-button"
					type="text"
					icon={<MenuOutlined />}
					onClick={showDrawer}
				/>
				<Menu
					mode="horizontal"
					theme="light"
					defaultSelectedKeys={defaultSelectedKeys()}
					className="user-layout-menu"
					items={menuItems}
				/>
			</Header>
			<Drawer
				title="Menu"
				placement="left"
				onClose={onClose}
				open={drawerVisible}>
				<Menu
					mode="vertical"
					theme="light"
					defaultSelectedKeys={defaultSelectedKeys()}
					openKeys={openKeys}
					onOpenChange={(keys) => setOpenKeys(keys)}
					items={menuItems}
				/>
			</Drawer>
			<Layout>
				<div className="user-layout-content">
					{children}
					<FooterComponent />
				</div>
			</Layout>
		</Layout>
	);
};

export default Main;
