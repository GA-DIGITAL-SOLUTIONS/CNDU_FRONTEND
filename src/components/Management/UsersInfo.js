import React from "react";
import { useAuth } from "../utils/useAuth";
import { useState, useEffect } from "react";
import {
	Popconfirm,
	Table,
	Button,
	message,
	Form,
	Input,
	Modal,
	Tabs,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import Main from "./Layout";
import "./UsersInfo.css";
import AddUser from "./Adduser";

const { TabPane } = Tabs;

const UsersInfo = () => {
	const { apiurl, token } = useAuth();
	const [form] = Form.useForm();
	const [form2] = Form.useForm();

	const [usersInfo, setUsersInfo] = useState([]);
	const [subscribedUsers, setSubscribedUsers] = useState([]);
	const [managerform, setManagerform] = useState(false);
	const [userform, setUserform] = useState(false);
	const [managementInfo, setManagementInfo] = useState([]);
	const [deliveryform, setDeliveryform] = useState(false);
	const [deliveryInfo, setDeliveryInfo] = useState([]);
	const [loading, setLoading] = useState(false);

	const addManager = async (values) => {
		if (values.password !== values.confirmpassword) {
			return message.error("Password and Confirm Password don't match");
		}
		setLoading(true);
		const response = await fetch(`${apiurl}/management/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				email: values.email,
				password: values.password,
			}),
		});
		if (response.ok) {
			message.success("Manager added successfully");
			form.resetFields();
			setLoading(false);
			setManagerform(false);
			getManagementInfo();
		}
	};

	const addDelivery = async (values) => {
		if (values.password !== values.confirmpassword) {
			return message.error("Password and Confirm Password don't match");
		}
		setLoading(true);
		const response = await fetch(`${apiurl}/delivery-partners/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				email: values.email,
				password: values.password,
				username: values.username,
			}),
		});
		if (response.ok) {
			message.success("Delivery Partner added successfully");
			form2.resetFields();
			setLoading(false);
			setDeliveryform(false);
			getDeliveryInfo();
		}
	};

	const deleteUser = async (id) => {
		try {
			const response = await fetch(`${apiurl}/management/`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ id }),
			});
			if (response.ok) {
				message.success("User deleted successfully");
				getUsersInfo();
			}
		} catch (error) {
			message.error("Failed to delete user");
		}
	};

	const deleteManager = async (id) => {
		try {
			const response = await fetch(`${apiurl}/management/`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ id }),
			});
			if (response.ok) {
				message.success("Manager deleted successfully");
				getManagementInfo();
			}
		} catch (error) {
			message.error("Failed to delete manager");
		}
	};

	const deleteDelivery = async (id) => {
		try {
			const response = await fetch(`${apiurl}/delivery-partners/`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ id }),
			});
			if (response.ok) {
				message.success("Delivery Partner deleted successfully");
				getDeliveryInfo();
			}
		} catch (error) {
			message.error("Failed to delete delivery partner");
		}
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Name",
			dataIndex: "username",
			key: "username",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			render: (_, record) => (
				<Popconfirm
					title="Are you sure you want to delete this user?"
					onConfirm={() => deleteUser(record.id)}
					okText="Yes"
					cancelText="No">
					<Button className="delete-button">Delete</Button>
				</Popconfirm>
			),
		},
	];

    const columns1 = [
			{
				title: "User",
				dataIndex: "first_name",
				key: "first_name",
			},
			{
				title: "Email",
				dataIndex: "email",
				key: "email",
			},

			{
				title: "Contact",
				dataIndex: "phone_number",
				key: "phone_number",
			},
			{
				title: "Plan",
				dataIndex: "name",
				key: "name",
			},
			{
				title: "Start Date",
				dataIndex: "subscription_plan_start_date",
				key: "subscription_plan_start_date",
			},
			{
				title: "End Date",
				dataIndex: "subscription_plan_end_date",
				key: "subscription_plan_end_date",
			},
			{
				title: "Active",
				dataIndex: "is_active",
				key: "is_active",
				render: (text) => (text ? "Yes" : "No"),
			},
		];


	const managerColumns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Name",
			dataIndex: "username",
			key: "username",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			render: (_, record) => (
				<Popconfirm
					title="Are you sure you want to delete this manager?"
					onConfirm={() => deleteManager(record.id)}
					okText="Yes"
					cancelText="No">
					<Button className="delete-button">Delete</Button>
				</Popconfirm>
			),
		},
	];

	const deliveryColumns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Name",
			dataIndex: "username",
			key: "username",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			render: (_, record) => (
				<Popconfirm
					title="Are you sure you want to delete this delivery partner?"
					onConfirm={() => deleteDelivery(record.id)}
					okText="Yes"
					cancelText="No">
					<Button className="delete-button">Delete</Button>
				</Popconfirm>
			),
		},
	];

	useEffect(() => {
		getDeliveryInfo();
		getManagementInfo();
		getUsersInfo();
        getSubscribedUsers();
	}, []);

	const getDeliveryInfo = async () => {
		const response = await fetch(`${apiurl}/delivery-partners/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.ok) {
			const data = await response.json();
			setDeliveryInfo(data.data);
		}
	};

	const getManagementInfo = async () => {
		const response = await fetch(`${apiurl}/management/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.ok) {
			const data = await response.json();
			setManagementInfo(data.data);
		}
	};

	const getUsersInfo = async () => {
		const response = await fetch(`${apiurl}/users/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.ok) {
			const data = await response.json();
			setUsersInfo(data.data);
		}
	};

    const getSubscribedUsers = async () => {
			const response = await fetch(`${apiurl}/subscribedusers/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setSubscribedUsers(data);
			}
		};

	return (
		<Main>
			<div className="users-info-container">
				<Tabs defaultActiveKey="1" className="tabs-container">
					<TabPane tab="Users" key="1">
						<div className="actions-container">
							<Button
								type="primary"
								className="add-button"
								onClick={() => setUserform(true)}>
								Add User
							</Button>
						</div>
						<Modal
							title="Add User"
							open={userform}
							onCancel={() => setUserform(false)}
							footer={false}
							className="modal-container">
									<AddUser />
							</Modal>
						<Table
							columns={columns}
							dataSource={usersInfo}
							className="data-table"
						/>
					</TabPane>
					<TabPane tab="Managers" key="2">
						<div className="actions-container">
							<Button
								type="primary"
								className="add-button"
								onClick={() => setManagerform(true)}>
								Add Manager
							</Button>
						</div>
						<Modal
							title="Add Manager"
							open={managerform}
							onCancel={() => setManagerform(false)}
							footer={false}
							className="modal-container">
							<Form onFinish={addManager} form={form}>
								<FormItem
									name="email"
									label="Email"
									rules={[
										{ required: true, message: "Please enter Email" },
										{ type: "email", message: "Please enter valid Email" },
									]}>
									<Input type="email" />
								</FormItem>
								<FormItem
									name="password"
									label="Password"
									rules={[{ required: true }]}>
									<Input type="password" />
								</FormItem>
								<FormItem
									name="confirmpassword"
									label="Confirm Password"
									rules={[{ required: true }]}>
									<Input type="password" />
								</FormItem>
								<FormItem>
									<Button
										type="primary"
										htmlType="submit"
										className="submit-button">
										Submit
									</Button>
								</FormItem>
							</Form>
						</Modal>
						<Table
							columns={managerColumns}
							dataSource={managementInfo}
							className="data-table"
						/>
					</TabPane>
					<TabPane tab="Delivery Partners" key="3">
						<div className="actions-container">
							<Button
								type="primary"
								className="add-button"
								onClick={() => setDeliveryform(true)}>
								Add Delivery Partner
							</Button>
						</div>
						<Modal
							title="Add Delivery Partner"
							open={deliveryform}
							onCancel={() => setDeliveryform(false)}
							footer={false}
							className="modal-container">
							<Form onFinish={addDelivery} form={form2}>
								<FormItem
									name="username"
									label="Username"
									rules={[
										{ required: true, message: "Please enter Username" },
									]}>
									<Input />
								</FormItem>
								<FormItem
									name="email"
									label="Email"
									rules={[
										{ required: true, message: "Please enter Email" },
										{ type: "email", message: "Please enter valid Email" },
									]}>
									<Input type="email" />
								</FormItem>
								<FormItem
									name="password"
									label="Password"
									rules={[{ required: true }]}>
									<Input type="password" />
								</FormItem>
								<FormItem
									name="confirmpassword"
									label="Confirm Password"
									rules={[{ required: true }]}>
									<Input type="password" />
								</FormItem>
								<FormItem>
									<Button
										type="primary"
										htmlType="submit"
										className="submit-button">
										Submit
									</Button>
								</FormItem>
							</Form>
						</Modal>
						<Table
							columns={deliveryColumns}
							dataSource={deliveryInfo}
							className="data-table"
						/>
					</TabPane>
					<TabPane tab="User Subscriptions" key="4">
						<Table
							columns={columns1}
							dataSource={subscribedUsers}
							className="data-table"
						/>
					</TabPane>
				</Tabs>
			</div>
		</Main>
	);
};

export default UsersInfo;
