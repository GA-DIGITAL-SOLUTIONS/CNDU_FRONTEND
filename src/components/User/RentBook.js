import React, { useState, useEffect } from "react";
import { List, Button, Modal, Form, Input, Radio, message } from "antd";
import Main from "./Layout";
import { useAuth } from "../utils/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import "./Books.css";

const RentBook = () => {
	const [addresses, setAddresses] = useState([]);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [book, setBook] = useState(null);
	const { apiurl, token } = useAuth();
	const { id } = useParams();
    const navigate = useNavigate();

	useEffect(() => {
		fetchAddresses();
		fetchBookDetails();
	}, []);

	const fetchBookDetails = async () => {
		try {
			const response = await fetch(`${apiurl}/getbook/${id}/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setBook(data.book);
			} else {
				throw new Error("Failed to fetch book details.");
			}
		} catch (error) {
			message.error("Failed to fetch book details.");
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
			console.error("Error fetching addresses:", error);
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
                'book':[id],
                'address':selectedAddress
            }
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
			}
            else{
                message.success(data.message);
                navigate('/orders');
            }
		} catch (error) {
			message.error("Failed to place order.");
		}
	};

	return (
		<Main>
			<div className="rentbook-view-container">
				<div className="rent-book-details-container">
					{book && (
						<>
							<img
								className="rent-book-image"
								src={`${apiurl}${book.image}`}
								alt={book.title}
							/>
							<div className="rent-book-info">
								<h1 className="rent-book-title">{book.title}</h1>
								<h3 className="rent-book-author">Author: {book.author}</h3>
							</div>
						</>
					)}
				</div>

				<List
					header={<div className="rent-book-address-header">Addresses</div>}
					footer={
						<Button
							type="primary"
							onClick={showModal}
							className="rent-book-add-address">
							Add Address
						</Button>
					}
					bordered
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

export default RentBook;
