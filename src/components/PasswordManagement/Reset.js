import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../utils/useAuth";
import Loader from "../Loader/Loader";
import img from "./../../images/forgotpassbanner.png";
import logo from "./../../images/logo.png";
import "./styles.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
	const { apiurl } = useAuth();
	const [loading, setLoading] = useState(false);

	const { uidb64, token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (values) => {
		setLoading(true);
		if (values.password !== values.confirmPassword) {
			message.error("Passwords do not match");
			setLoading(false);
			return;
		}

		try {
			const password = values.password;

			const response = await fetch(
				`${apiurl}/reset-password/${uidb64}/${token}/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ password }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				message.error(errorData.message);
				setLoading(false);
			}
			message.success("Reset Successful.! Redirecting you to login");
			form.resetFields();
			setLoading(false);
			setTimeout(() => {
				navigate("/login");
			}, 1500);
		} catch (error) {
			setLoading(false);
			message.error("An error occurred while resetting the password");
		}
	};

	const [form] = Form.useForm();

	if (loading) {
		return <Loader />;
	}

	return (
		<>
			<div className="forgot-page">
				<div className="right-sec hide-mobile">
					<img className="forgot-banner-img" src={img} alt="forgotpass" />
				</div>
				<div className="left-sec">
					<div className="top-section">
						<img src={logo} alt="Logo" />
					</div>
					<Form
						form={form}
						className="form"
						title="Reset Password"
						layout="vertical"
						initialValues={{
							remember: true,
						}}
						onFinish={handleSubmit}
						autoComplete="off">
						<h1>Reset Password</h1>
						<Form.Item
							label="Password"
							name="password"
							rules={[
								{
									required: true,
									message: "Please input your password!",
								},
							]}>
							<Input.Password />
						</Form.Item>

						<Form.Item
							label="Confirm Password"
							name="confirmPassword"
							rules={[
								{
									required: true,
									message: "Please input your password!",
								},
							]}>
							<Input.Password />
						</Form.Item>

						<Form.Item>
							<Button
								className="login-submit-btn"
								type="primary"
								htmlType="submit">
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
