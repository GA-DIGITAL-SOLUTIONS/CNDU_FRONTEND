import React, { useState, useEffect } from "react";
import { Layout, Table, Button, message } from "antd";
import {
	EllipsisOutlined,
	ShoppingCartOutlined,
	AppstoreOutlined,
	UserOutlined,
	ClockCircleOutlined,
} from "@ant-design/icons";
import DashboardCard from "./DashboardCard/DashboardCard";
import "./AdminDashboard.css";
import { Outlet } from "react-router-dom";
import Main from "../AdminLayout/AdminLayout";
import { useSelector } from "react-redux";

const { Content } = Layout;

const AdminDashBoard = () => {
	const [metrics, setMetrics] = useState(null);
	const [loading, setLoading] = useState(false);

	const [ordersData, setOrdersData] = useState([]);

	const { apiurl, access_token } = useSelector((state) => state.auth);

	const fetchMetrics = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${apiurl}adminmetrics/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setMetrics(data);
		} catch (error) {
			message.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMetrics();
	}, []);

	useEffect(() => {
		if (metrics?.recent_orders) {
			const modifiedOrders = metrics.recent_orders.map((order) => ({
				...order,
				username: order.user?.username || "N/A",
			}));
			setOrdersData(modifiedOrders);
		}
	}, [metrics]);

	const cardsData = [
		{
			title: metrics?.total_orders || 0,
			subtitle: "Total Orders",
			Icon: <ShoppingCartOutlined style={{ fontSize: 32, color: "#4caf50" }} />,
		},
		{
			title: metrics?.total_products || 0,
			subtitle: "Products",
			Icon: <AppstoreOutlined style={{ fontSize: 32, color: "#2196f3" }} />,
		},
		{
			title: metrics?.total_customers || 0,
			subtitle: "Users",
			Icon: <UserOutlined style={{ fontSize: 32, color: "#ff9800" }} />,
		},
		{
			title: metrics?.pending_orders || 0,
			subtitle: "Pending Orders",
			Icon: <ClockCircleOutlined style={{ fontSize: 32, color: "#f44336" }} />,
		},
	];

	const columns = [
		{
			title: "Order ID",
			dataIndex: "id",
			key: "id",
			render: (id) => <a href={`/adminorder/${id}`}>{id}</a>,
		},
		{
			title: "Customer Name",
			dataIndex: "username",
			key: "username",
		},
		{
			title: "Created At",
			dataIndex: "created_at",
			key: "created_at",
			render: (text) => new Date(text).toLocaleString(),
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
		},
		{
			title: "Total Price",
			dataIndex: "total_order_price",
			key: "total_order_price",
			render: (price) => `₹${price.toFixed(2)}`,
		},
	];

	const bestSellersColumns = [
		{
			title: "Product Name",
			dataIndex: "product",
			key: "name",
		},
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
			render: (price) => `₹${price}`,
		},
		{
			title: "Units Sold",
			dataIndex: "num_buyed",
			key: "num_buyed",
		},
	];

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<Main>
			<Content className="admin-home-content">
				<Outlet />
				<div className="admin-home-cards-container">
					{cardsData.map((card, index) => (
						<DashboardCard
							key={index}
							title={card.title}
							subtitle={card.subtitle}
							Icon={card.Icon}
						/>
					))}
				</div>

				<div className="admin-home-graph-bestseller">
					<h2>Best Sellers</h2>
					<Table
						className="admin-home-bestsellers-table"
						dataSource={metrics?.best_sellers || []}
						columns={bestSellersColumns}
						rowKey="id"
						pagination={false}
					/>
				</div>

				<div className="admin-home-recent-orders">
					<div className="admin-home-orders-header">
						<h2>Recent Orders</h2>
					</div>
					<Table
						className="admin-home-orders-table"
						dataSource={ordersData}
						columns={columns}
						rowKey="id"
						pagination={false}
					/>
				</div>
			</Content>
		</Main>
	);
};

export default AdminDashBoard;
