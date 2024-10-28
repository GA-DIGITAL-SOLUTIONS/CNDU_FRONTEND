import React, { useState, useEffect } from "react";
import { List, Button, Modal, Form, Input, message, Select, Radio } from "antd";
import Main from "./Layout";
import { useAuth } from "../utils/useAuth";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const AddOrder = () => {
	const { apiurl, token } = useAuth();
	const [users, setUsers] = useState([]);
	const [books, setBooks] = useState([]);
	const [addresses, setAddresses] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [selectedBooks, setSelectedBooks] = useState([]);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		fetchUsers();
		fetchBooks();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await fetch(`${apiurl}/users/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) throw new Error("Failed to fetch users");
			const data = await response.json();
			setUsers(data.data);
		} catch (error) {
			message.error("Failed to fetch users.");
		}
	};

	const fetchBooks = async () => {
		try {
			const response = await fetch(`${apiurl}/books/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) throw new Error("Failed to fetch books");
			const data = await response.json();
			setBooks(data.data);
		} catch (error) {
			message.error("Failed to fetch books.");
		}
	};

	const fetchAddresses = async (userId) => {
		try {
			const response = await fetch(
				`${apiurl}/useraddresses/${userId}/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (!response.ok) throw new Error("Failed to fetch addresses");
			const data = await response.json();
			setAddresses(data.data);
		} catch (error) {
			message.error("Failed to fetch addresses.");
		}
	};

	const showAddressModal = () => {
		setIsAddressModalVisible(true);
	};

	const handleAddAddress = async () => {
		try {
			const values = await form.validateFields();
			const response = await fetch(`${apiurl}/useraddresses/${selectedUser}/`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user_id: selectedUser,
					...values,
				}),
			});
			if (!response.ok) throw new Error("Failed to add address");
			await response.json();
			message.success("Address added successfully.");
			fetchAddresses(selectedUser);
			setIsAddressModalVisible(false);
			form.resetFields();
		} catch (error) {
			message.error("Failed to add address");
		}
	};

	const handleUserSelect = (value) => {
		setSelectedUser(value);
		fetchAddresses(value); 
	};

	const handleBookSelect = (value) => {
		setSelectedBooks(value); 
	};

	const handleOrder = async () => {
		if (!selectedAddress || !selectedUser || selectedBooks.length === 0) {
			message.error("Please select a user, books, and an address.");
			return;
		}

		try {
			const response = await fetch(`${apiurl}/addorder/`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user_id: selectedUser,
					books: selectedBooks,
					addr_id: selectedAddress,
				}),
			});
			const data = await response.json();
			if (!response.ok) {
				message.error(data.error);
			} else {
				message.success(data.message);
				window.location.reload();
			}
		} catch (error) {
			message.error("Failed to place order.");
		}
	};

	return (
		<>
			<div className="add-order-container">

				<Select
					placeholder="Select a User"
					style={{ width: "100%", marginBottom: "20px" }}
					onChange={handleUserSelect}>
					{users.map((user) => (
						<Option key={user.id} value={user.id}>
							{user.email}
						</Option>
					))}
				</Select>

				<Select
					mode="multiple"
					placeholder="Select Books"
					style={{ width: "100%", marginBottom: "20px" }}
					onChange={handleBookSelect}>
					{books.map((book) => (
						<Option key={book.id} value={book.id}>
							{book.title}
						</Option>
					))}
				</Select>

				<List
					header={<div>Your Addresses</div>}
					footer={
						<Button type="primary" onClick={showAddressModal}>
							Add Address
						</Button>
					}
					dataSource={addresses}
					renderItem={(item) => (
						<List.Item key={item.id}>
							<Radio
								value={item.id}
								checked={selectedAddress === item.id}
								onChange={() => setSelectedAddress(item.id)}>
								{item.address}, {item.city}, {item.state}, {item.pincode}
							</Radio>
						</List.Item>
					)}
				/>

				<Button
					type="primary"
					onClick={handleOrder}
					disabled={
						!selectedUser || selectedBooks.length === 0 || !selectedAddress
					}
					style={{ marginTop: "20px" }}>
					Place Order
				</Button>

				<Modal
					title="Add Address"
					open={isAddressModalVisible}
					onOk={handleAddAddress}
					onCancel={() => setIsAddressModalVisible(false)}>
					<Form form={form} layout="vertical">
						<Form.Item
							name="address"
							label="Address"
							rules={[
								{ required: true, message: "Please input the address!" },
							]}>
							<Input />
						</Form.Item>
						<Form.Item
							name="city"
							label="City"
							rules={[{ required: true, message: "Please input the city!" }]}>
							<Input />
						</Form.Item>
						<Form.Item
							name="state"
							label="State"
							rules={[{ required: true, message: "Please input the state!" }]}>
							<Input />
						</Form.Item>
						<Form.Item
							name="pincode"
							label="Pin Code"
							rules={[
								{ required: true, message: "Please input the pin code!" },
							]}>
							<Input />
						</Form.Item>
					</Form>
				</Modal>
			</div>
		</>
	);
};

export default AddOrder;
