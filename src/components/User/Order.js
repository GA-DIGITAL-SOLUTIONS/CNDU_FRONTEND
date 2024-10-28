import React, { useEffect, useState } from "react";
import Main from "./Layout";
import { useAuth } from "../utils/useAuth";
import { message, List, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import icon from "./orderbook.jpeg";
import OrderDetails from "./OrderDetails";
import UserOrderDetails from "./OrderDetails";

const UserOrders = () => {
	const { apiurl, token } = useAuth();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [selectedOrderId, setSelectedOrderId] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const response = await fetch(`${apiurl}/myorders/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			if (!response.ok) {
				message.error(data.error);
			} else {
				setOrders(data.data);
			}
		} catch (error) {
			message.error("Failed to fetch orders");
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		return moment(dateString).format("MMM DD, YYYY");
	};

	const goBackToOrderList = () => {
		setSelectedOrderId(null);
	};

	if (selectedOrderId) {
		return (
			<>
				<Button onClick={goBackToOrderList} style={{ marginBottom: "8px" }}>
					Back to Orders
				</Button>
				<UserOrderDetails id={selectedOrderId} />
			</>
		);
	}

	return (
		<>
			<List
				className="user-orders-list"
				loading={loading}
				dataSource={orders}
				pagination={{
					current: currentPage,
					pageSize: pageSize,
					onChange: (page, pageSize) => {
						setCurrentPage(page);
						setPageSize(pageSize);
					},
					showSizeChanger: true,
					pageSizeOptions: ["5", "10", "20", "50"],
				}}
				renderItem={(order) => (
					<List.Item key={order.id}>
						<div className="user-orders-list-item">
							<h3>Order ID: {order.id}</h3>
							<div className="order-content">
								<div className="order-image">
									<img src={icon} alt="Book" className="order-book-image" />
								</div>
								<div className="order-details">
									<h3>
										{order?.book?.length > 0
											? (() => {
													const titles = order.book
														.map((item) => item.title)
														.join(", ");
													return titles.length > 50
														? titles.slice(0, 50) + "..."
														: titles;
											  })()
											: "No books available"}
									</h3>
									<p>
										<strong>Order Placed:</strong>{" "}
										{formatDate(order.ordered_at)}
									</p>
									<p>
										<strong>Shipping Address:</strong>{" "}
										{order.deliver_to_address}
									</p>
									<p>
										<strong>Status:</strong> {order.status}
									</p>
								</div>
								<div className="order-actions">
									<Button
										type="primary"
										className="view-order-button"
										onClick={() => setSelectedOrderId(order.id)}>
										View Order
									</Button>
								</div>
							</div>
						</div>
					</List.Item>
				)}
			/>
		</>
	);
};

export default UserOrders;
