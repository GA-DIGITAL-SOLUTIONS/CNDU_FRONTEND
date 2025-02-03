import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/useAuth";
import "./Profile.css";
import { Button, Modal, Form, Input, message, List, Tabs } from "antd";
import Main from "./Layout";
import ppic from "./../../images/profile.jpeg";
import { useNavigate } from "react-router-dom";
import {
	EditOutlined,
	LogoutOutlined,
	HomeOutlined,
	PlusOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import UserOrders from "./Order";
import ChangePasswordForm from "../Forgotpassword/Change";



const UserProfile = () => {
	const { apiurl, token, handleLogout } = useAuth();
	const [modalVisible, setModalVisible] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [addresses, setAddresses] = useState([]);
	const [currentPlan, setCurrentPlan] = useState({});
	const navigate = useNavigate();

	const [formData, setFormData] = useState({});
	const [form] = Form.useForm();
	const [activeTab, setActiveTab] = useState("profile");

	useEffect(() => {
		fetchUserDetails();
		fetchAddresses();
		fetchSubscription();
	}, []);

	const handleUpdate = async (values) => {
		const response = await fetch(`${apiurl}/userdetails/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		if (response.ok) {
			message.success("Profile updated successfully!");
			fetchUserDetails();
			setModalVisible(false);
		} else {
			message.error("Failed to update profile");
		}
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
			message.success("Address added successfully.");
			fetchAddresses();
			setIsModalVisible(false);
			form.resetFields();
		} catch (error) {
			message.error("Failed to add address");
		}
	};

	const fetchSubscription = async () => {
		try {
			const response = await fetch(`${apiurl}/usersubscription/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setCurrentPlan(data);
			}
		} catch {
			// console.log("Error fetching subscription");
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
			const data = await response.json();
			setAddresses(data.data);
		} catch (error) {
			message.error("Failed to fetch addresses.");
		}
	};

	const fetchUserDetails = async () => {
		const response = await fetch(`${apiurl}/userdetails/`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		setFormData(data.data);
		form.setFieldsValue(data.data);
	};

	const handleLogoutClick = () => {
		Modal.confirm({
			title: "Are you sure you want to logout?",
			icon: <ExclamationCircleOutlined />,
			okText: "Yes",
			cancelText: "No",
			onOk() {
				handleLogout();
				navigate("/login");
			},
		});
	};

	const formatDate = (date) => {
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(date).toLocaleDateString("en-US", options);
	};

	return (
		<Main>
			<div className="user-profile-container">
				<div className="sidebar">
					<img src={ppic} alt="Profile" className="sidebar-profile-pic" />
					<h2>
						{formData.first_name} {formData.last_name}
					</h2>
					<p>{formData.email}</p>
					{currentPlan && (
						<div className="plan-det">
							<h3>
								<u>Plan Details</u>
							</h3>
							<p>Name : {currentPlan.data?.name}</p>
							<p>Books Allowed : {currentPlan.data?.books_allowed}</p>
							<p>Start Date : {formatDate(currentPlan.start)}</p>
							<p>End Date : {formatDate(currentPlan.end)}</p>
						</div>
					)}
					<Button
						type="primary"
						icon={<LogoutOutlined />}
						onClick={handleLogoutClick}
						className="sidebar-logout-btn">
						Logout
					</Button>
				</div>

				<div className="profile-content">
					<Tabs
						defaultActiveKey="profile"
						activeKey={activeTab}
						onChange={(key) => setActiveTab(key)}>
						<Tabs.TabPane tab="Profile" key="profile">
							<div className="profile-header">
								<h3>Profile Details</h3>
								<Button
									type="primary"
									icon={<EditOutlined />}
									onClick={() => setModalVisible(true)}>
									Edit Profile
								</Button>
							</div>
							<div className="profile-details">
								<div className="profile-info">
									<div className="profile-field">
										<label>First Name</label>
										<div>{formData.first_name}</div>
									</div>
									<div className="profile-field">
										<label>Last Name</label>
										<div>{formData.last_name}</div>
									</div>
								</div>
								<div className="profile-info">
									<div className="profile-field">
										<label>Child Name</label>
										<div>{formData.child_name}</div>
									</div>
									<div className="profile-field">
										<label>Date of Birth</label>
										<div>{formData.dob}</div>
									</div>
								</div>
								<div className="profile-info">
									<div className="profile-field">
										<label>Mobile Number</label>
										<div>{formData.phone_number}</div>
									</div>
									<div className="profile-field">
										<label>Email</label>
										<div>{formData.email}</div>
									</div>
								</div>
							</div>

							<List
								header={<h3>Saved Addresses</h3>}
								footer={
									<Button
										type="dashed"
										icon={<PlusOutlined />}
										onClick={() => setIsModalVisible(true)}
										className="add-address-btn">
										Add Address
									</Button>
								}
								bordered
								dataSource={addresses}
								renderItem={(item) => (
									<List.Item key={item.id}>
										<HomeOutlined />{" "}
										{`${item.address}, ${item.city}, ${item.state}, ${item.pincode}`}
									</List.Item>
								)}
							/>
						</Tabs.TabPane>

						<Tabs.TabPane tab="My Orders" key="orders">
							<UserOrders />
						</Tabs.TabPane>
						<Tabs.TabPane tab="Change Password" key="change">
							<ChangePasswordForm />
						</Tabs.TabPane>
					</Tabs>
				</div>

				<Modal
					title="Edit Profile"
					open={modalVisible}
					footer={null}
					onCancel={() => setModalVisible(false)}>
					<Form form={form} onFinish={handleUpdate}>
						<Form.Item label="First Name" name="first_name">
							<Input />
						</Form.Item>
						<Form.Item label="Last Name" name="last_name">
							<Input />
						</Form.Item>
						<Form.Item
							label="Phone No"
							name="phone_number"
							rules={[
								{ len: 10, message: "Please enter a valid 10-digit Mobile No" },
							]}>
							<Input type="number" />
						</Form.Item>
						<Form.Item label="Child Name" name="child_name">
							<Input />
						</Form.Item>
						<Form.Item label="Date of Birth" name="dob">
							<Input type="date" />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								Save Changes
							</Button>
						</Form.Item>
					</Form>
				</Modal>

				<Modal
					title="Add Address"
					open={isModalVisible}
					onOk={handleOk}
					onCancel={() => setIsModalVisible(false)}>
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
							label="Pincode"
							rules={[
								{ required: true, message: "Please input the pincode!" },
							]}>
							<Input />
						</Form.Item>
					</Form>
				</Modal>
			</div>
		</Main>
	);
};

export default UserProfile;
