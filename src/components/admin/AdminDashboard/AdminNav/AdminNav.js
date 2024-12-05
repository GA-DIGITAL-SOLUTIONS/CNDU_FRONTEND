import React from "react";
import "./AdminNav.css";
import { Layout, Menu } from "antd";
import {
	DashboardOutlined,
	ShoppingCartOutlined,
	AppstoreOutlined,
	DeploymentUnitOutlined,
	ShoppingOutlined,
	UndoOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";


const { Sider } = Layout;

const AdminNav = () => {
	return (
		<>
			<Sider className="admin-sider" width="20%">
				{/* <img src={adminnavlogo} alt="Logo" className="logo-image" /> */}
				<Menu mode="inline" defaultSelectedKeys={["1"]} className="admin-menu">
					<Menu.Item key="1" icon={<DashboardOutlined />}>
						<Link to="/dashboard">DashBoard</Link>
					</Menu.Item>
					<Menu.Item key="2" icon={<ShoppingCartOutlined />}>
						<Link to="/products">Products</Link>
					</Menu.Item>
					<Menu.Item key="3" icon={<AppstoreOutlined />}>
						<Link to="/fabrics">Fabrics</Link>
					</Menu.Item>
					<Menu.Item key="4" icon={<DeploymentUnitOutlined />}>
						<Link to="/admincombinations">Combination</Link>
					</Menu.Item>
					<Menu.Item key="5" icon={<ShoppingOutlined />}>
						<Link to="/AdminOrders">Orders</Link>
					</Menu.Item>
					<Menu.Item key="6" icon={<UndoOutlined />}>
						<Link to="/returned">Returned</Link>
					</Menu.Item>
					<Menu.Item key="7" icon={<UserOutlined />}>
						<Link to="/profile">Profile</Link>
					</Menu.Item>
				</Menu>
			</Sider>
		</>
	);
};

export default AdminNav;
