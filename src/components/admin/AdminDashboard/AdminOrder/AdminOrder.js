import React, { useState, useEffect } from "react";
import { fetchOrderById } from "../../../../store/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Card from "antd/es/card/Card";
import "./AdminOrder.css";
import { Col, Row, Table, Select, Button, Modal } from "antd";
import { updateOrderStatus } from "../../../../store/orderSlice";
import Main from "../../AdminLayout/AdminLayout";

const { Option } = Select;

const AdminOrder = () => {
	const { id } = useParams();
	const { apiurl, access_token } = useSelector((state) => state.auth);
	const { SingleOrder } = useSelector((state) => state.orders);

	const dispatch = useDispatch();

	const [orderStatus, setOrderStatus] = useState(SingleOrder?.status);
	const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

	useEffect(() => {
		const orderId = id;
		dispatch(fetchOrderById({ apiurl, access_token, orderId }));
	}, [dispatch, apiurl, id]);

	const handleStatusChange = (value) => {
		setOrderStatus(value);
	};

	const handleChangeClick = () => {
		const UpdatedStatus = orderStatus;
		dispatch(
			updateOrderStatus({
				apiurl,
				access_token,
				UpdatedStatus,
				orderId: SingleOrder.id,
			})
		)
			.unwrap()
			.then(() => {
				const orderId = id;
				dispatch(fetchOrderById({ apiurl, access_token, orderId }));
				setIsModalVisible(false); // Close modal after update
			});
	};

	const dataSource = SingleOrder.items
		? SingleOrder.items.map((item) => ({
				key: item.id,
				product: item.item,
				quantity: item.quantity,
				price: item.total_price,
		  }))
		: [];

	const totalRow = {
		key: "total",
		product: "Total Order Amount",
		quantity: "",
		price: SingleOrder.total_order_price || 0,
	};

	const columns = [
		{
			title: "Product",
			dataIndex: "product",
			key: "product",
			width: 250,
			render: (product, record) => {
				if (record.key === "total") {
					return <strong>{product}</strong>;
				}

				const firstImage =
					product.images.length > 0
						? product.images[0].image
						: "https://via.placeholder.com/80";
				return (
					<Row
						style={{
							display: "flex",
							alignItems: "center",
							gap: "16px",
						}}>
						<Col>
							<img
								src={`${apiurl}${firstImage}`}
								alt={product.product}
								className="admin-order-table wishlist_images"
								style={{
									width: "60px",
									height: "60px",
									objectFit: "cover",
									borderRadius: "8px",
									border: "1px solid #ddd",
								}}
							/>
						</Col>
						<Col style={{ flex: 1 }}>
							<p style={{ fontWeight: "bold", margin: 0 }}>{product.product}</p>
							<p style={{ fontWeight: "bold", margin: 0 }}>
								color: {product.color?.name}
							</p>
						</Col>
					</Row>
				);
			},
		},
		{
			title: "Quantity",
			dataIndex: "quantity",
			key: "quantity",
			render: (quantity, record) => {
				return record.key === "total" ? null : <p>{quantity}</p>;
			},
		},
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
			render: (price) => {
				return <p>{price}</p>;
			},
		},
	];

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<Main>
			<div className="admin-order-container">
				<Modal
					title="Update Order Status"
					open={isModalVisible}
					onOk={handleChangeClick}
					onCancel={handleCancel}
					okText="Update"
					cancelText="Cancel">
					<Select
						value={orderStatus}
						onChange={handleStatusChange}
						style={{ width: "100%" }}>
						<Option value="shipped">Shipped</Option>
						<Option value="delivered">Delivered</Option>
						<Option value="returned">Returned</Option>
						<Option value="pending">Pending</Option>
					</Select>
				</Modal>

				<div className="admin-order-cards">
					<Card
						title={`Order Id : ${SingleOrder?.id}`}
						className="admin-order-card">
						<p>
							<strong>Method:</strong> {SingleOrder?.payment_method}
						</p>
						<p>
							<strong>Status:</strong> {SingleOrder?.payment_status}
						</p>
						<p>
							<strong>Current Status:</strong> {SingleOrder?.status}{" "}
							<Button type="text" danger onClick={showModal}>
								Update
							</Button>
						</p>
					</Card>

					<Card title="Customer Details" className="admin-order-card">
						<p>
							<strong>Username:</strong> {SingleOrder?.user?.username}
						</p>
						<p>
							<strong>Email:</strong> {SingleOrder?.user?.email}
						</p>
						<p>
							<strong>Phone Number:</strong> {SingleOrder?.user?.phone_number}
						</p>
					</Card>

					<Card title="Shipping" className="admin-order-card">
						<p>
							<strong>Address:</strong> {SingleOrder?.shipping_address?.address}
						</p>
						<p>
							<strong>City:</strong> {SingleOrder?.shipping_address?.city}
						</p>
						<p>
							<strong>Pincode:</strong> {SingleOrder?.shipping_address?.pincode}
						</p>
						<p>
							<strong>State:</strong> {SingleOrder?.shipping_address?.state}
						</p>
					</Card>
				</div>

				<Table
					className="admin-order-table"
					style={{ marginTop: "50px" }}
					dataSource={[...dataSource, totalRow]}
					columns={columns}
					rowKey="id"
					pagination={false}
				/>
			</div>
		</Main>
	);
};

export default AdminOrder;
