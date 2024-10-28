import React, { useEffect, useState } from "react";
import Main from "./Layout";
import { useAuth } from "../utils/useAuth";
import { message, List, Input, Modal, Form, Button, Radio } from "antd";
import "./Order.css";

const UserOrderDetails = ({id}) => {
	const { apiurl, token } = useAuth();
	const [order, setOrder] = useState({});
	const [addresses, setAddresses] = useState([]);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
	const [reviewFormVisible, setReviewFormVisible] = useState(false);
	const [bookId, setBookId] = useState();
	const [reviews, setReviews] = useState({});
	const [form] = Form.useForm();
	const [form2] = Form.useForm();

	useEffect(() => {
		fetchOrder();
		fetchAddresses();
	}, []);

	useEffect(() => {
		if (order.book) {
			order.book.forEach((book) => fetchUserReview(book.id));
		}
	}, [order]);

	const fetchUserReview = async (bookId) => {
		try {
			const response = await fetch(`${apiurl}/userreviews/${bookId}/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setReviews((prevReviews) => ({ ...prevReviews, [bookId]: data.data }));
			}
		} catch (error) {
			message.error("Failed to fetch user reviews.");
		}
	};

	const addOrUpdateReview = async (values) => {
		const method = reviews[bookId] ? "PUT" : "POST";
		const url =
			method === "POST"
				? `${apiurl}/reviews/`
				: `${apiurl}/bookreviews/${reviews[bookId]?.id || ""}/`;
		const response = await fetch(url, {
			method: method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				rating: values.rating,
				comment: values.comment,
				bookid: bookId,
			}),
		});
		if (response.ok) {
			const data = await response.json();
			message.success(data.success);
			form2.resetFields();
			setReviewFormVisible(false);
			fetchUserReview(bookId);
		}
	};

	const fetchOrder = async () => {
		try {
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
		} catch (error) {
			message.error("Failed to fetch order details.");
		}
	};

	const fetchAddresses = async () => {
		try {
			const response = await fetch(`${apiurl}/myaddresses/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				throw new Error("Failed to fetch addresses");
			}
			const data = await response.json();
			setAddresses(data.data);
		} catch (error) {
			message.error("Failed to fetch addresses.");
		}
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			const response = await fetch(`${apiurl}/myaddresses/`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});
			if (!response.ok) {
				throw new Error("Failed to add address");
			}
			await response.json();
			message.success("Address added successfully.");
			fetchAddresses();
			setIsModalVisible(false);
			form.resetFields();
		} catch (error) {
			message.error("Failed to add address");
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setIsAddressModalVisible(false);
		setReviewFormVisible(false);
	};

	const handleAddressSelect = (e) => {
		setSelectedAddress(e.target.value);
	};

	const handleReturn = async () => {
		if (!selectedAddress) {
			message.error("Please select an address.");
			return;
		}

		try {
			const response = await fetch(`${apiurl}/return/`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ address: selectedAddress, order: id }),
			});
			if (response.ok) {
				message.success("Return requested successfully.");
				setIsAddressModalVisible(false);
			} else {
				message.error("Failed to return books.");
			}
		} catch (error) {
			console.error("Error returning books:", error);
		}
	};

	const showAddressModal = () => {
		setIsAddressModalVisible(true);
	};

	return (
		<>
			{order && (
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
										{reviews[book.id] ? (
											<div className="review-container">
												<div className="book-review">
													<strong>Rating:</strong> {reviews[book.id].rating}{" "}
													<br />
													<strong>Comment:</strong> {reviews[book.id].comment}
												</div>
												<Button
													onClick={() => {
														setReviewFormVisible(true);
														setBookId(book.id);
														form2.setFieldsValue({
															rating: reviews[book.id].rating,
															comment: reviews[book.id].comment,
														});
													}}>
													Edit Review
												</Button>
											</div>
										) : (
											<div className="review-container">
												<div></div>
												<Button
													onClick={() => {
														setReviewFormVisible(true);
														setBookId(book.id);
													}}>
													Add a Review
												</Button>
											</div>
										)}
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
					{order.status === "delivered" && (
						<Button onClick={showAddressModal} className="return-button">
							Return Books
						</Button>
					)}

					<Modal
						title="Select Address for Return"
						open={isAddressModalVisible}
						onOk={handleReturn}
						onCancel={()=>setIsAddressModalVisible(false)}>
						<List
							footer={
								<Button
									type="primary"
									onClick={showModal}
									className="rent-book-add-address">
									Add Address
								</Button>
							}
							dataSource={addresses}
							renderItem={(item) => (
								<List.Item key={item.id} className="rent-book-address-item">
									<Radio
										className="rent-book-radio"
										value={item.id}
										checked={selectedAddress === item.id}
										onChange={handleAddressSelect}>
										{`${item.address}, ${item.city}, ${item.state}, ${item.pincode}`}
									</Radio>
								</List.Item>
							)}
						/>
					</Modal>

					<Modal
						title="Add Address"
						open={isModalVisible}
						onOk={handleOk}
						onCancel={()=>setIsModalVisible(false)}>
						<Form form={form} layout="vertical">
							<Form.Item
								name="address"
								label="Address"
								rules={[
									{ required: true, message: "Please input the address!" },
								]}>
								<Input className="rent-book-input" />
							</Form.Item>
							<Form.Item
								name="city"
								label="City"
								rules={[{ required: true, message: "Please input the city!" }]}>
								<Input className="rent-book-input" />
							</Form.Item>
							<Form.Item
								name="state"
								label="State"
								rules={[
									{ required: true, message: "Please input the state!" },
								]}>
								<Input className="rent-book-input" />
							</Form.Item>
							<Form.Item
								name="pincode"
								label="Pincode"
								rules={[
									{ required: true, message: "Please input the pincode!" },
								]}>
								<Input className="rent-book-input" />
							</Form.Item>
						</Form>
					</Modal>

					<Modal
						title="Add Review"
						open={reviewFormVisible}
						onOk={form2.submit}
						onCancel={handleCancel}>
						<Form form={form2} layout="vertical" onFinish={addOrUpdateReview}>
							<Form.Item
								name="rating"
								label="Rating"
								rules={[
									{ required: true, message: "Please input your rating!" },
								]}>
								<Input type="number" />
							</Form.Item>
							<Form.Item
								name="comment"
								label="Comment"
								rules={[
									{ required: true, message: "Please input your comment!" },
								]}>
								<Input.TextArea />
							</Form.Item>
						</Form>
					</Modal>
				</div>
			)}
		</>
	);
};

export default UserOrderDetails;
