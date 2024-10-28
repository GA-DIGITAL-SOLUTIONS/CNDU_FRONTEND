import React, { useEffect, useState } from "react";
import Main from "./Layout";
import { useAuth } from "../utils/useAuth";
import { message, List, Button, Modal,} from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import icon from "../User/orderbook.jpeg";
import AddOrder from "./CreateOrder";

const AdminOrders = () => {
	const { apiurl, token } = useAuth();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [isopen, setIsOpen] = useState(false);
	const [pageSize, setPageSize] = useState(10);
	const navigate = useNavigate();

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const response = await fetch(`${apiurl}/order/`, {
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

	return (
		<Main>
			<div className="actions-container">
				<Button
					type="primary"
					className="add-button"
					onClick={() => setIsOpen(true)}>
					Add Order
				</Button>
			</div>
			<Modal
				title="Add Order"
				open={isopen}
				onCancel={() => setIsOpen(false)}
				footer={false}
				className="">
				<AddOrder />
			</Modal>
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
							<div style={{ display: "flex" }}>
								<div style={{ flex: "0 0 120px", marginRight: "16px" }}>
									<img
										src={icon}
										alt="Book"
										style={{
											width: "100%",
											borderRadius: "5px",
										}}
									/>
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ flex: 1 }}>
										<h3 style={{ marginTop: 0 }}>
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
									</div>
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
									{/* <p>
										<strong>Estimated Delivery:</strong>{" "}
										{formatDate(order.estimated_delivery)}
									</p> */}
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-between",
									}}>
									<Button
										type="primary"
										style={{
											backgroundColor: "#1890ff",
											borderColor: "#1890ff",
											color: "#fff",
											marginBottom: "10px",
											padding: "6px 12px",
											borderRadius: "4px",
											cursor: "pointer",
										}}
										onClick={() => {
											navigate(`/admin/orders/${order.id}`);
										}}>
										View Order
									</Button>
								</div>
							</div>
						</div>
					</List.Item>
				)}
			/>
		</Main>
	);
};

export default AdminOrders;
