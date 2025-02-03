import React, { useEffect, useState } from "react";
import Main from "../Management/Layout";
import { useAuth } from "../utils/useAuth";
import { message, List, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import icon from "../User/orderbook.jpeg";
import AddOrder from "./CreateReturn";

const UserReturns = () => {
	const { apiurl, token } = useAuth();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isopen, setIsOpen] = useState(false);
	
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const navigate = useNavigate();

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const response = await fetch(`${apiurl}/return/`, {
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
				// console.log(data.data)
			}
		} catch (error) {
			message.error("Failed to fetch orders");
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const day = date.getDate();
		const month = date.toLocaleString("default", { month: "long" });
		const year = date.getFullYear();

		const daySuffix = (day) => {
			if (day > 3 && day < 21) return "th";
			switch (day % 10) {
				case 1:
					return "st";
				case 2:
					return "nd";
				case 3:
					return "rd";
				default:
					return "th";
			}
		};

		return `${day}${daySuffix(day)} ${month} ${year}`;
	};



	return (
		<Main>
			<div className="actions-container">
				<Button
					type="primary"
					className="add-button"
					onClick={() => setIsOpen(true)}>
					Add Return
				</Button>
			</div>
			<Modal
				title="Add Return"
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
							<h3>Return ID: {order.id}</h3>
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
											{order?.order?.book?.length > 0
												? (() => {
														const titles = order.order.book
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
										<strong>Return Placed:</strong>{" "}
										{formatDate(order.return_request_at)}
									</p>
									<p>
										<strong>Address:</strong> {order.return_to.address}
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
											navigate(`/returns/${order.id}`);
										}}
										zzz>
										View
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

export default UserReturns;
