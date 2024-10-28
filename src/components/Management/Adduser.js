import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuth";
import { Button, Form, Input, Select, message, DatePicker } from "antd";

const { Option } = Select;

const AddUser = () => {
	const { apiurl, token } = useAuth();
	const [subscriptionPlans, setSubscriptionPlans] = useState([]);
	const [loading, setLoading] = useState(false);

	
	const fetchSubscriptionPlans = async () => {
		try {
			const response = await fetch(`${apiurl}/subscriptionplans/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) throw new Error(`Error: ${response.statusText}`);
			const data = await response.json();
			setSubscriptionPlans(data.data); 
		} catch (error) {
			message.error("Error fetching subscription plans.");
			console.error("Error fetching subscription plans:", error);
		}
	};

	useEffect(() => {
		fetchSubscriptionPlans(); 
	}, []);

	const handleSubmit = async (values) => {
		setLoading(true);
		try {
			const response = await fetch(`${apiurl}/adduser/`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					first_name: values.firstName,
					last_name: values.lastName,
					email: values.email,
					password: values.password,
					phone_number: values.phoneNumber,
					dob: values.dob ? values.dob.format("YYYY-MM-DD") : null, 
					child_name: values.childName,
					amount: values.amount,
					subscription_plan: values.subscriptionPlan,
				}),
			});

			const data = await response.json();
			if (response.ok) {
				message.success(data.message);
				window.location.reload();
			} else {
				message.error(data.error);
			}
		} catch (error) {
			message.error("Error adding user.");
			console.error("Error adding user:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="add-user-container">
			<Form layout="vertical" onFinish={handleSubmit}>
				<Form.Item
					label="First Name"
					name="firstName"
					rules={[{ required: true, message: "Please input the first name!" }]}>
					<Input />
				</Form.Item>
				<Form.Item
					label="Last Name"
					name="lastName"
					rules={[{ required: true, message: "Please input the last name!" }]}>
					<Input />
				</Form.Item>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							type: "email",
							message: "Please input a valid email!",
						},
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					label="Password"
					name="password"
					rules={[{ required: true, message: "Please input a password!" }]}>
					<Input.Password />
				</Form.Item>
				<Form.Item
					label="Phone Number"
					name="phoneNumber"
					rules={[{ required: true, message: "Please input a phone number!" }]}>
					<Input />
				</Form.Item>
				<Form.Item
					label="Date of Birth"
					name="dob">
					<DatePicker format="YYYY-MM-DD" />
				</Form.Item>
				<Form.Item label="Child Name" name="childName">
					<Input />
				</Form.Item>
				<Form.Item
					label="Amount"
					name="amount"
					rules={[{ required: true, message: "Please input the amount!" }]}>
					<Input type="number" />
				</Form.Item>
				<Form.Item
					label="Subscription Plan"
					name="subscriptionPlan"
					rules={[
						{ required: true, message: "Please select a subscription plan!" },
					]}>
					<Select placeholder="Select a subscription plan">
						{subscriptionPlans.map((plan) => (
							<Option key={plan.id} value={plan.id}>
								{plan.name} - {plan.duration} Months
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loading}>
						Add User
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default AddUser;
