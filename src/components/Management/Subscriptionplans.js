import React, { useEffect, useState } from "react";
import Main from "./Layout";
import { useAuth } from "../utils/useAuth";
import { message, Table, Button, Modal, Form, Input, Select } from "antd";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "./SubscriptionPlans.css";

const { confirm } = Modal;
const { Option } = Select;

const SubscriptionPlans = () => {
	const { apiurl, token } = useAuth();
	const [subscriptionPlans, setSubscriptionPlans] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [currentPlan, setCurrentPlan] = useState(null);
	const [form] = Form.useForm();

	const fetchPlans = async () => {
		try {
			const response = await fetch(`${apiurl}/subscriptionplans/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			if (response.ok) {
				setSubscriptionPlans(data.data);
			} else {
				message.error("Failed to fetch subscription plans");
			}
		} catch (error) {
			message.error("Error fetching subscription plans");
		}
	};

	const showModal = (plan = null) => {
		setIsEditing(!!plan);
		setCurrentPlan(plan);
		setModalTitle(plan ? "Edit Plan" : "Add Plan");
		setIsModalVisible(true);
		if (plan) {
			form.setFieldsValue(plan);
		} else {
			form.resetFields();
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		form.resetFields();
	};

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			if (isEditing && currentPlan) {
				const response = await fetch(`${apiurl}/subscriptionplans/`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ id: currentPlan.id, ...values }),
				});
				if (response.ok) {
					message.success("Plan updated successfully");
				} else {
					message.error("Failed to update plan");
				}
			} else {
				const response = await fetch(`${apiurl}/subscriptionplans/`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(values),
				});
				if (response.ok) {
					message.success("Plan added successfully");
				} else {
					message.error("Failed to add plan");
				}
			}
			setIsModalVisible(false);
			fetchPlans();
		} catch (error) {
			message.error("Failed to save plan");
		}
	};

	const showDeleteConfirm = (planId) => {
		confirm({
			title: "Are you sure you want to delete this plan?",
			icon: <ExclamationCircleOutlined />,
			okText: "Yes",
			okType: "danger",
			cancelText: "No",
			onOk: async () => {
				try {
					const response = await fetch(`${apiurl}/subscriptionplans/`, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ id: planId }),
					});
					if (response.ok) {
						message.success("Plan deleted successfully");
						fetchPlans();
					} else {
						message.error("Failed to delete plan");
					}
				} catch (error) {
					message.error("Error deleting plan");
				}
			},
		});
	};

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Duration (in months)",
			dataIndex: "duration",
			key: "duration",
		},
		{
			title: "Books Allowed",
			dataIndex: "books_allowed",
			key: "books_allowed",
		},
		{
			title: "Caution Deposit",
			dataIndex: "caution_deposit",
			key: "caution_deposit",
		},
		{
			title: "One Time Registration",
			dataIndex: "one_time_reg_fee",
			key: "one_time_reg_fee",
		},
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
		},
		{
			title: "Type",
			dataIndex: "s_type",
			key: "s_type",
			render: (s_type) => (
				<span>
					{s_type === "books"
						? "Books"
						: s_type === "toys"
						? "Toys"
						: "Books + Toys"}
				</span>
			),
		},
		{
			title: "Action",
			key: "action",
			render: (text, record) => (
				<span>
					<Button type="link" onClick={() => showModal(record)}>
						Edit
					</Button>
					<Button
						type="link"
						danger
						onClick={() => showDeleteConfirm(record.id)}>
						Delete
					</Button>
				</span>
			),
		},
	];

	useEffect(() => {
		fetchPlans();
	}, []);

	return (
		<Main>
			<div className="admin-subs-main">
				<div style={{ marginBottom: "16px", textAlign: "right" }}>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => showModal()}>
						Add Plan
					</Button>
				</div>

				<Table
					dataSource={subscriptionPlans}
					columns={columns}
					rowKey="id"
					pagination={{ pageSize: 6 }}
				/>

				<Modal
					title={modalTitle}
					open={isModalVisible}
					onOk={handleOk}
					onCancel={handleCancel}
					okButtonProps={{ type: "primary" }}>
					<Form form={form} layout="vertical">
						<Form.Item
							name="name"
							label="Name"
							rules={[{ required: true, message: "Please enter plan name" }]}>
							<Input />
						</Form.Item>

						<Form.Item
							name="duration"
							label="Duration (in months)"
							rules={[{ required: true, message: "Please enter duration" }]}>
							<Input />
						</Form.Item>

						<Form.Item
							name="books_allowed"
							label="Books Allowed"
							rules={[
								{ required: true, message: "Please enter books allowed" },
							]}>
							<Input type="number" />
						</Form.Item>

						<Form.Item
							name="caution_deposit"
							label="Caution Deposit"
							rules={[
								{ required: true, message: "Please enter caution deposit" },
							]}>
							<Input type="number" />
						</Form.Item>

						<Form.Item
							name="one_time_reg_fee"
							label="One Time Registration Fee"
							rules={[
								{ required: true, message: "Please enter caution deposit" },
							]}>
							<Input type="number" />
						</Form.Item>

						<Form.Item
							name="price"
							label="Price"
							rules={[{ required: true, message: "Please enter price" }]}>
							<Input type="number" />
						</Form.Item>

						<Form.Item
							name="s_type"
							label="Type"
							rules={[
								{ required: true, message: "Please select a plan type" },
							]}>
							<Select placeholder="Select Type" className="inp">
								<Option value="books">Books</Option>
								<Option value="toys">Toys</Option>
								<Option value="both">Books + Toys</Option>
							</Select>
						</Form.Item>
					</Form>
				</Modal>
			</div>
		</Main>
	);
};

export default SubscriptionPlans;
