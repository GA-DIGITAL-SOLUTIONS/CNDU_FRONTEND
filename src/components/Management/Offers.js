import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, notification } from "antd";
import { useAuth } from "../utils/useAuth";
import Main from "./Layout";
import './Offer.css';

const { Column } = Table;
const { Option } = Select;

const OfferManager = () => {
	const [couponCodes, setCouponCodes] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [subscriptionPlans, setSubscriptionPlans] = useState([]);
	const [form] = Form.useForm();
	const { apiurl, token } = useAuth();

	useEffect(() => {
		fetchCouponCodes();
		fetchSubscriptionPlans();
	}, []);

	const fetchCouponCodes = async () => {
		try {
			const response = await fetch(`${apiurl}/offeradmin/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) throw new Error("Network response was not ok");
			const data = await response.json();
			setCouponCodes(data.data);
		} catch (error) {
			notification.error({
				message: "Error",
				description: "Failed to fetch offers.",
			});
		}
	};

	const fetchSubscriptionPlans = async () => {
		try {
			const response = await fetch(`${apiurl}/subscriptionplans/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) throw new Error("Network response was not ok");
			const data = await response.json();
			setSubscriptionPlans(data.data);
		} catch (error) {
			notification.error({
				message: "Error",
				description: "Failed to fetch subscription plans.",
			});
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await fetch(`${apiurl}/offeradmin/`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ id: id }),
			});
			if (!response.ok) throw new Error("Network response was not ok");
			fetchCouponCodes();
			notification.success({
				message: "Success",
				description: "Coupon code deleted successfully.",
			});
		} catch (error) {
			notification.error({
				message: "Error",
				description: "Failed to delete coupon code.",
			});
		}
	};

	const handleAddNew = () => {
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields();
			const { name, no_of_months_free, start_date, end_date, s_id } = values;
			const response = await fetch(`${apiurl}/offeradmin/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					name,
					no_of_months_free,
					start_date,
					end_date,
					s_id,
				}),
			});
			if (!response.ok) throw new Error("Network response was not ok");
			setIsModalVisible(false);
			fetchCouponCodes();
			notification.success({
				message: "Success",
				description: "Offer created successfully.",
			});
		} catch (error) {
			notification.error({
				message: "Error",
				description: "Failed to create offer.",
			});
		}
	};

	const handleModalCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<>
			<Button
				type="primary"
				onClick={handleAddNew}
				className="offerManager-addButton">
				Add New
			</Button>
			<Table
				dataSource={couponCodes}
				rowKey="id"
				className="offerManager-table"
				components={{
					header: {
						cell: (props) => <th {...props} className="tableHeader" />,
					},
				}}>
				<Column title="Name" dataIndex="name" key="name" />
				<Column
					title="No of Months Free"
					dataIndex="no_of_months_free"
					key="no_of_months_free"
				/>
				<Column
					title="Start Date"
					dataIndex="start_date"
					key="start_date"
					render={(date) => new Date(date).toLocaleDateString()}
				/>
				<Column
					title="End Date"
					dataIndex="end_date"
					key="end_date"
					render={(date) => new Date(date).toLocaleDateString()}
				/>
				<Column
					title="Action"
					key="action"
					render={(text, record) => (
						<Button
							type="link"
							danger
							onClick={() => handleDelete(record.id)}
							className="offerManager-deleteButton">
							Delete
						</Button>
					)}
				/>
			</Table>
			<Modal
				title="Add New Offer"
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
				okText="Add"
				cancelText="Cancel"
				className="offerManager-modal">
				<Form form={form} layout="vertical" className="offerManager-form">
					<Form.Item
						name="name"
						label="Offer Name"
						rules={[
							{ required: true, message: "Please input the offer name!" },
						]}
						className="offerManager-formItem">
						<Input />
					</Form.Item>
					<Form.Item
						name="no_of_months_free"
						label="No of Months Free"
						rules={[
							{
								required: true,
								message: "Please input the number of months free!",
							},
						]}
						className="offerManager-formItem">
						<Input type="number" />
					</Form.Item>
					<Form.Item
						name="start_date"
						label="Start Date"
						rules={[
							{ required: true, message: "Please select the start date!" },
						]}
						className="offerManager-formItem">
						<Input type="date" />
					</Form.Item>
					<Form.Item
						name="end_date"
						label="End Date"
						rules={[{ required: true, message: "Please select the end date!" }]}
						className="offerManager-formItem">
						<Input type="date" />
					</Form.Item>
					<Form.Item
						name="s_id"
						label="Subscription Plan"
						rules={[
							{ required: true, message: "Please select a subscription plan!" },
						]}
						className="offerManager-formItem">
						<Select placeholder="Select a subscription plan">
							{subscriptionPlans.map((plan) => (
								<Option key={plan.id} value={plan.id}>
									{plan.name} - {plan.duration}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default OfferManager;
