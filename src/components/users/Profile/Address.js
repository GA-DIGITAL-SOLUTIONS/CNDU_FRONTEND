import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Popconfirm, message } from "antd";
import {
	addUserAddress,
	fetchUserAddress,
	updateUserAddress,
	deleteUserAddress,
} from "../../../store/userAdressSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Importing icons

const Address = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [currentAddressId, setCurrentAddressId] = useState(null);
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const { apiurl, access_token } = useSelector((state) => state.auth);
	const { addresses } = useSelector((state) => state.address);
	const Navigate = useNavigate();

	useEffect(() => {
		dispatch(fetchUserAddress({ apiurl, access_token }));
	}, []);

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			const addressData = values;

			if (isEdit) {
				await dispatch(
					updateUserAddress({
						apiurl,
						access_token,
						addressData,
						id: currentAddressId,
					})
				).unwrap();
			} else {
				await dispatch(
					addUserAddress({ apiurl, access_token, addressData })
				).unwrap();
			}

			dispatch(fetchUserAddress({ apiurl, access_token }));
			setIsModalVisible(false);
			setIsEdit(false);
			form.resetFields();
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	const handleEdit = (address) => {
		setIsModalVisible(true);
		setIsEdit(true);
		setCurrentAddressId(address.id);
		form.setFieldsValue({
			address: address.address,
			city: address.city,
			state: address.state,
			pincode: address.pincode,
		});
	};

	const handleDelete = async (id) => {
		try {
			await dispatch(deleteUserAddress({ apiurl, access_token, id })).unwrap();
			dispatch(fetchUserAddress({ apiurl, access_token }));
			message.success("Address deleted successfully");
		} catch (error) {
			message.error("Failed to delete address");
		}
	};

	return (
		<div className="user_address_container">
			{addresses?.data && addresses.data.length > 0 ? (
				<div className="user_address_list">
					{addresses.data.map((item) => (
						<div className="user_address_item" key={item.id}>
							<div className="user_address_details">
								<p>
									<strong>Address:</strong> {item.address}
								</p>
								<p>
									<strong>City:</strong> {item.city}
								</p>
								<p>
									<strong>State:</strong> {item.state}
								</p>
								<p>
									<strong>Pincode:</strong> {item.pincode}
								</p>
							</div>
							<div className="user_address_actions">
								<Button
									type="link"
									icon={<EditOutlined />}
									onClick={() => handleEdit(item)}></Button>
								<Popconfirm
									title="Are you sure you want to delete this address?"
									onConfirm={() => handleDelete(item.id)}
									okText="Yes"
									cancelText="No">
									<Button type="link" icon={<DeleteOutlined />} danger></Button>
								</Popconfirm>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="user_address_empty">No addresses available.</p>
			)}

			{/* Modal to Add/Edit Address */}
			<Modal
				title={isEdit ? "Edit Address" : "Add Address"}
				open={isModalVisible}
				onOk={handleOk}
				onCancel={() => setIsModalVisible(false)}>
				<Form form={form} layout="vertical">
					<Form.Item
						name="address"
						label="Address"
						rules={[{ required: true, message: "Please input the address!" }]}>
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
						label="Pincode"
						rules={[{ required: true, message: "Please input the pincode!" }]}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>

			{/* Add Address Button at the Bottom */}
			<Button
				type="primary"
				className="user_address_add_button"
				onClick={() => {
					setIsModalVisible(true);
					setIsEdit(false);
					form.resetFields();
				}}>
				Add Address
			</Button>
		</div>
	);
};

export default Address;