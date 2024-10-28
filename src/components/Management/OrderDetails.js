import React, { useEffect, useState } from "react";
import Main from "./Layout";
import { useAuth } from "../utils/useAuth";
import {
	message,
	List,
	Input,
	Select,
	DatePicker,
	Card,
	Button,
	Modal,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const AdminOrderDetails = () => {
	const { apiurl, token } = useAuth();
	const navigate = useNavigate();
	const [order, setOrder] = useState([]);
	const { id } = useParams();
	const [dps, setDps] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isModalVisible1, setIsModalVisible1] = useState(false);
	const [selectedDP, setSelectedDP] = useState(null);

	useEffect(() => {
		fetchOrder();
	}, []);

	const fetchOrder = async () => {
		const response = await fetch(`${apiurl}/order/${id}/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();
		if (response.ok) {
			setOrder(data.data);
		} else {
			message.error(data.error);
		}
	};

	const fetchDeliveryPartners = async () => {
		const response = await fetch(`${apiurl}/delivery-partners/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();
		if (response.ok) {
			setDps(data.data);
		} else {
			message.error(data.error);
		}
	};

	const handleAssignDP = async () => {
		if (!selectedDP) {
			message.error("Please select a delivery partner");
			return;
		}

		const response = await fetch(`${apiurl}/assign/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				id: order.id,
				user_id: selectedDP,
			}),
		});
		const data = await response.json();
		if (response.ok) {
			message.success("Delivery partner assigned successfully");
			setIsModalVisible(false);
			fetchOrder();
		} else {
			message.error(data.error);
		}
	};

	const showModal = () => {
		fetchDeliveryPartners();
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleOk = async () => {
		const response = await fetch(`${apiurl}/order/`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ id, status: "delivered" }),
		});
		const data = await response.json();
		if (response.ok) {
			message.success("Order status updated successfully");
			setOrder({ ...order, status: "delivered" });
		} else {
			message.error(data.error);
		}
		setIsModalVisible1(false);
	};

	return (
		<Main>
			{order && (
				<div className="admin-od">
					<div className="order-details-container">
						<div className="order-header">
							<h3>Order ID: {order.id}</h3>
							<div className="order-meta">
								<span>
									Order date: {new Date(order.ordered_at).toLocaleDateString()}
								</span>
								<span>
									Estimated delivery:{" "}
									{new Date(order.estimated_delivery).toLocaleDateString()}
								</span>
							</div>
						</div>

						<div className={`order-progress ${order.status}`}>
							<div
								className={`order-progress-step ${
									order.status === "ordered" ||
									order.status === "assigned" ||
									order.status === "delivered" ||
									order.status === "returned"
										? "active"
										: ""
								}`}>
								<div className="status-label">Order Confirmed</div>
								<div className="status-dot"></div>
								<div className="status-date">
									{new Date(order.ordered_at).toLocaleDateString()}
								</div>
							</div>
							<div
								className={`order-progress-step ${
									order.status === "assigned" ||
									order.status === "delivered" ||
									order.status === "returned"
										? "active"
										: ""
								}`}>
								<div className="status-label">Delivery Partner Assigned</div>
								<div className="status-dot"></div>
								<div className="status-date">
									{order.assigned_at
										? new Date(order.assigned_at).toLocaleDateString()
										: "-"}
								</div>
							</div>
							<div
								className={`order-progress-step ${
									order.status === "delivered" || order.status === "returned"
										? "active"
										: ""
								}`}>
								<div className="status-label">Delivered</div>
								<div className="status-dot"></div>
								<div className="status-date">
									{order.delivered_at
										? new Date(order.delivered_at).toLocaleDateString()
										: "-"}
								</div>
							</div>
							<div
								className={`order-progress-step ${
									order.status === "returned" ? "active" : ""
								}`}>
								<div className="status-label">Returned</div>
								<div className="status-dot"></div>
								<div className="status-date">
									{order.returned_at
										? new Date(order.returned_at).toLocaleDateString()
										: "-"}
								</div>
							</div>
						</div>

						<div className="books-list">
							{order.book &&
								order.book.map((book) => (
									<div key={book.id} className="book-card">
										<img src={`${apiurl}${book.image}`} alt={book.title} />
										<div className="book-details">
											<div className="book-title">{book.title}</div>
											<div className="book-author">{book.author}</div>
										</div>
									</div>
								))}
						</div>

						<div className="subscription-delivery">
							<div className="section">
								<div className="section-title">Delivery Address</div>
								<div className="section-content">
									{order.deliver_to_address}, {order.deliver_to_city},{" "}
									{order.deliver_to_state} - {order.deliver_to_pincode}
								</div>
							</div>
						</div>
					</div>
					<div className="right-sec">
						<div>Status: {order.status}</div>
						{order.status !== "delivered" && order.status !== "returned" && (
							<Button onClick={() => setIsModalVisible1(true)}>
								Update Status
							</Button>
						)}
						<div>
							Delivery Partner: {order.delivery_partner || "Not Assigned"}
						</div>
						{!order.delivery_partner && (
							<Button onClick={showModal}>Assign Delivery Partner</Button>
						)}
					</div>

					<Modal
						title="Assign Delivery Partner"
						open={isModalVisible}
						onOk={handleAssignDP}
						onCancel={handleCancel}>
						<Select
							style={{ width: "100%" }}
							placeholder="Select a delivery partner"
							onChange={(value) => setSelectedDP(value)}>
							{dps.map((dp) => (
								<Option key={dp.id} value={dp.id}>
									{dp.username}
								</Option>
							))}
						</Select>
					</Modal>
					<Modal
						title="Confirm Update"
						open={isModalVisible1}
						onOk={handleOk}
						onCancel={() => setIsModalVisible1(false)}>
						<p>Are you sure you want to update the status to "delivered"?</p>
					</Modal>
				</div>
			)}
		</Main>
	);
};

export default AdminOrderDetails;
