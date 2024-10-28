import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
	HomeOutlined,
	DashboardOutlined,
	ShoppingCartOutlined,
	ReconciliationOutlined,
	PlusCircleOutlined,
	CalendarOutlined,
	TagOutlined,
	MailOutlined,
	LogoutOutlined,
	DollarOutlined,
	GiftOutlined,
	TeamOutlined,
	WechatWorkOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import "./Layout.css";
import logo from "./../../images/logo.svg";
import { useAuth } from "../utils/useAuth";

const { Header, Sider } = Layout;

const Main = ({ children }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const {handleLogout} = useAuth();

	const handleLogoutClick = () => {
		handleLogout();
		navigate("/login");
	};
	const defaultSelectedKeys = () => {
		const pathname = location.pathname;
		const menuItems = [
			"/admin/home",
			"/inventory",
			"/admin/orders",
			"/admin/returns",
			"/admin/activities/add",
			"/admin/activities",
			"/subscriptionplans",
			"/newsletter",
			"/offers",
			"/admin/users",
			"/admin/payments",
		];

		const index = menuItems.findIndex((item) => pathname.includes(item));
		return index !== -1 ? [`${index + 1}`] : [""];
	};

	const menuItems = [
		{
			key: "1",
			icon: <HomeOutlined />,
			label: <Link to="/admin/home">Home</Link>,
		},
		{
			key: "2",
			icon: <DashboardOutlined />,
			label: <Link to="/inventory">Inventory</Link>,
		},
		{
			key: "3",
			icon: <ShoppingCartOutlined />,
			label: <Link to="/admin/orders">Orders</Link>,
		},
		{
			key: "4",
			icon: <ReconciliationOutlined />,
			label: <Link to="/admin/returns">Returns</Link>,
		},
		{
			key: "5",
			icon: <PlusCircleOutlined />,
			label: <Link to="/admin/activities/add">Add an Activity</Link>,
		},
		{
			key: "6",
			icon: <CalendarOutlined />,
			label: <Link to="/admin/activities">Activities</Link>,
		},
		{
			key: "7",
			icon: <TagOutlined />,
			label: <Link to="/subscriptionplans">Subscription Plans</Link>,
		},
		{
			key: "8",
			icon: <MailOutlined />,
			label: <Link to="/newsletter">News Letter</Link>,
		},
		{
			key: "9",
			icon: <GiftOutlined />,
			label: <Link to="/offers">Offers</Link>,
		},
		{
			key: "10",
			icon: <TeamOutlined />,
			label: <Link to="/admin/users">Users</Link>,
		},
		{
			key: "11",
			icon: <DollarOutlined />,
			label: <Link to="/admin/payments">Payments</Link>,
		},
		{
			key: "12",
			icon: <WechatWorkOutlined />,
			label: <Link to="/admin/reviews">Review</Link>,
		},
	];

	return (
		<Layout>
			<Sider
				className="side"
				breakpoint="md"
				collapsedWidth="0"
				width={"225px"}
				style={{
					height: "calc(100vh - 100px)",
					position: "fixed",
					left: "0",
					top: "100px",
					bottom: 0,
					zIndex: 1,
				}}>
				<Menu
					mode="inline"
					theme="dark"
					defaultSelectedKeys={defaultSelectedKeys()}
					className="menu"
					items={menuItems}
				/>
			</Sider>
			<Layout>
				<Header className="head">
					<div className="header-logo">
						<a href="/">
							<img alt="logo" src={logo} />
						</a>
					</div>
					<Button
						type="primary"
						icon={<LogoutOutlined />}
						onClick={handleLogoutClick}
						className="sidebar-logout-btn">
						Logout
					</Button>
				</Header>

				<div className="content">{children}</div>
			</Layout>
		</Layout>
	);
};

export default Main;
