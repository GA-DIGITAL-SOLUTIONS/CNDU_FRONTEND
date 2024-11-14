// src/components/Signup.js

import React, { useState } from "react";
import { Form, Input, Button, message, Select, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import img from "./../../images/signupbanner.png"; 
import logo from "./../../images/logo.png";
import Loader from "../Loader/Loader";
import "./signup.css"; 

const { Option } = Select;

const countryCodes = [
	{ code: "+1", country: "United States" },
	{ code: "+44", country: "United Kingdom" },
	{ code: "+91", country: "India" },
	{ code: "+81", country: "Japan" },
	{ code: "+61", country: "Australia" },
];

const Signup = () => {
	const dispatch = useDispatch(); // Hook to dispatch actions
	const navigate = useNavigate();
	const { loading, error } = useSelector((state) => state.auth); // Access loading and error from Redux state
	const [form] = Form.useForm();
// console.log(state)
	const onFinish = async (values) => {
	
		console.log("Form Values:", values);

		// Dispatch the signup action
		const resultAction = await dispatch(signup(values));
		console.log(
			"response",resultAction)

		if (signup.fulfilled.match(resultAction)) {
			message.success("Signup Successful!");
			navigate("/login");
			// console.log(resultAction)
		} else {
			message.error(resultAction.error.message || "Signup failed");
		}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="signup-signuppage">
			<div className="right-sec">
				<img
					className="signup-banner-img"
					src={img}
					alt="Fabric and Clothing Banner"
				/>
			</div>
			<div className="left-sec">
				<div className="top-section">
					<img src={logo} alt="Logo" />
				</div>
				<div>
					<Form
						form={form}
						layout="vertical"
						className="form"
						onFinish={onFinish}
						initialValues={{ remember: true }}>
						<h1>Join Us</h1>
						<p>Create an account to explore our collection of fabrics and clothing.</p>

						<Row gutter={16}>
							<Col xs={24} sm={12}>
								<Form.Item
									name="username"
									label="User Name"
									rules={[{ required: true, message: "Please input your username!" }]}>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={12}>
								<Form.Item
									name="email"
									label="Email"
									rules={[{ required: true, message: "Please input your email!" }]}>
									<Input />
								</Form.Item>
							</Col>
						</Row>

						<Form.Item label="Contact Information" rules={[{ required: true, message: "Please enter your phone number!" }]}>
							<Row gutter={16}>
								<Col xs={6} sm={4}>
									<Form.Item
										name="country_code"
										rules={[{ required: true, message: "Please select your country code!" }]}
										style={{ margin: 0 }}>
										<Select placeholder="Country Code">
											{countryCodes.map(({ code }) => (
												<Option key={code} value={code}>
													{code}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col xs={18} sm={20}>
									<Form.Item
										name="phone_number"
										rules={[{ required: true, message: "Please input your phone number!" }]}
										style={{ margin: 0 }}>
										<Input placeholder="Phone Number" />
									</Form.Item>
								</Col>
							</Row>
						</Form.Item>

						<Row gutter={16}>
							<Col xs={24} sm={12}>
								<Form.Item
									name="password"
									label="Password"
									rules={[{ required: true, message: "Please input your password!" }]}>
									<Input.Password className="pwd" />
								</Form.Item>
							</Col>
							<Col xs={24} sm={12}>
								<Form.Item
									name="cpassword"
									label="Confirm Password"
									dependencies={["password"]}
									hasFeedback
									rules={[
										{ required: true, message: "Please confirm your password!" },
										({ getFieldValue }) => ({
											validator(_, value) {
												if (!value || getFieldValue("password") === value) {
													return Promise.resolve();
												}
												return Promise.reject(new Error("The two passwords that you entered do not match!"));
											},
										}),
									]}>
									<Input.Password className="pwd" />
								</Form.Item>
							</Col>
						</Row>

						<Form.Item>
							<Button
								className="signup-submit-btn"
								type="primary"
								htmlType="submit"
								loading={loading}>
								Sign Up -&gt;
							</Button>
						</Form.Item>
					</Form>
				</div>
				<div className="login-signup-btn">
					Already have an account? <Link to="/login">Log In</Link>
				</div>
			</div>
		</div>
	);
};

export default Signup;
