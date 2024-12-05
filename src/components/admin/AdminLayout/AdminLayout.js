import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
	DashboardOutlined,
	ShoppingCartOutlined,
	AppstoreOutlined,
	DeploymentUnitOutlined,
	ShoppingOutlined,
	UndoOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import "./AdminLayout.css";
import logo from "./adminnavlogo.svg";

const { Header, Sider } = Layout;

const Main = ({ children }) => {
	const location = useLocation();
	const navigate = useNavigate();
	// const { handleLogout } = useAuth();

	const handleLogoutClick = () => {
		// handleLogout();
		navigate("/login");
	};

	const defaultSelectedKeys = () => {
		const pathname = location.pathname;
		const menuItems = [
			"/dashboard",
			"/inventory",
			"/admincombinations",
			"/addproduct",
			"/adminorders",
			"/admin/returns",
			"/discounts",
		];

		const index = menuItems.findIndex((item) => pathname.includes(item));
		return index !== -1 ? [`${index + 1}`] : [""];
	};

	const menuItems = [
		{
			key: "1",
			icon: <DashboardOutlined />,
			label: <Link to="/dashboard">Dashboard</Link>,
		},
		{
			key: "2",
			icon: <ShoppingCartOutlined />,
			label: <Link to="/inventory">Inventory</Link>,
		},

		{
			key: "3",
			icon: <DeploymentUnitOutlined />,
			label: <Link to="/admincombinations">Combination</Link>,
		},
		{
			key: "4",
			icon: <AppstoreOutlined />,
			label: <Link to="/addproduct">Add Product</Link>,
		},
		{
			key: "5",
			icon: <ShoppingOutlined />,
			label: <Link to="/adminorders">Orders</Link>,
		},
		{
			key: "6",
			icon: <UndoOutlined />,
			label: <Link to="/returned">Returnes</Link>,
		},
		{
			key: "7",
			icon: <DollarCircleOutlined />,
			label: <Link to="/discounts">Discounts</Link>,
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
					theme="light"
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
					{/* <Button
						type="primary"
						icon={<LogoutOutlined />}
						onClick={handleLogoutClick}
						className="sidebar-logout-btn">
						Logout
					</Button> */}
				</Header>

				<div className="content">{children}</div>
			</Layout>
		</Layout>
	);
};

export default Main;
