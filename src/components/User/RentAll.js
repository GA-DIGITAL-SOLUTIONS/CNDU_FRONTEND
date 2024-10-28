import React, { useState, useEffect } from "react";
import { List, Button, Modal, Form, Input, Radio, message } from "antd";
import Main from "./Layout";
import { useAuth } from "../utils/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import "./RentAll.css";

const RentAll = () => {
	const [addresses, setAddresses] = useState([]);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const { apiurl, token } = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		fetchAddresses();
	}, []);


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
	};

	const handleAddressSelect = (e) => {
		setSelectedAddress(e.target.value);
	};

	const handleRent = async () => {
		try {
			const values = {
				address: selectedAddress,
			};
			const response = await fetch(`${apiurl}/order/`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});
			const data = await response.json();
			if (!response.ok) {
				message.error(data.error);
			} else {
				message.success(data.message);
				navigate("/orders");
			}
		} catch (error) {
			message.error("Failed to place order.");
		}
	};

	return (
		<Main>
			<div className="rentbook-view-container">
				<List
					header={<div className="rent-book-address-header">Your Addresses</div>}
					footer={
						<Button
							type="primary"
							onClick={showModal}
							className="rent-book-add-address">
							Add Address
						</Button>
					}
					className="address-list"
					dataSource={addresses}
					renderItem={(item) => (
						<List.Item key={item.id} className="rent-book-address-item">
							<Radio
								className="rent-book-radio"
								value={item.id}
								checked={selectedAddress === item.id}
								onChange={handleAddressSelect}>
								<div className="radio-content">
									<div className="city">City : {item.city}</div>
									<div className="state">State : {item.state}</div>
									<div className="pincode">Pincode : {item.pincode}</div>
									<pre><strong>Complete Address</strong> : <br></br>{item.address}</pre>
								</div>
							</Radio>
						</List.Item>
					)}
				/>

				<Button
					type="primary"
					onClick={handleRent}
					disabled={!selectedAddress}
					style={{ marginTop: "10px" }}
					className="rent-book-rent-button">
					Rent
				</Button>

				<Modal
					title="Add Address"
					open={isModalVisible}
					onOk={handleOk}
					onCancel={handleCancel}>
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
							rules={[{ required: true, message: "Please input the state!" }]}>
							<Input className="rent-book-input" />
						</Form.Item>
						<Form.Item
							name="pincode"
							label="Pin Code"
							rules={[
								{ required: true, message: "Please input the pin code!" },
							]}>
							<Input className="rent-book-input" />
						</Form.Item>
					</Form>
				</Modal>
			</div>
		</Main>
	);
};

export default RentAll;
