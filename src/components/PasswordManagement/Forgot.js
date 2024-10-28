import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../utils/useAuth";
import Loader from "../Loader/Loader";
import img from "./../../images/forgotpassbanner.png";
import logo from "./../../images/logo.png";
import "./styles.css";

const ForgotPassword = () => {
	const { apiurl } = useAuth();
	const [loading, setLoading] = useState(false);

	const handleForgotPassword = async (values) => {
		setLoading(true);

		try {
			const response = await fetch(`${apiurl}/forgot-password/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			const data = await response.json();
			if (response.ok) {
				setLoading(false);
				message.success(data.success);
				form.resetFields();
			} else {
				setLoading(false);
				message.success(data.error);
			}
		} catch (error) {
			setLoading(false);
			message.error("An error occurred. Please try again.");
		}
	};

	const [form] = Form.useForm();

	if (loading) {
		return <Loader />;
	}

	return (
		<>
			<div className="forgot-page">
				<div className="right-sec">
					<img className="forgot-banner-img" src={img} alt="forgotpass" />
				</div>
				<div className="left-sec">
					<div className="top-section">
						<img src={logo} alt="Logo" />
					</div>
					<Form
						form={form}
						layout="vertical"
						title="Forgot Password"
						className="form"
						initialValues={{
							remember: true,
						}}
						onFinish={handleForgotPassword}
						autoComplete="off">
						<h1>Forgot Password</h1>
						<Form.Item
							label="Phone Number"
							name="phone_number"
							rules={[
								{
									required: true,
									message: "Please input your 10 digit mobile number!",
								},
								{
									len: 10,
									message: "Please input valid 10 digit mobile number!",
								},
							]}>
							<Input type="number" className="inp" />
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								className="forgot-submit-btn">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</>
	);
};

export default ForgotPassword;
