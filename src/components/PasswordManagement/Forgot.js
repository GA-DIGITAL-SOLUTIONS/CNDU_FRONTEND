import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../utils/useAuth";
import Loader from "../Loader/Loader";
import img from "./../../images/forgotpassbanner.png";
import logo from "./../../images/logo.png";
import "./styles.css";
import { forgotPassword } from "../../store/password/passwordSlice";
import { useDispatch, useSelector } from "react-redux";
const ForgotPassword = () => {
	const dispatch = useDispatch();
	const [form] = Form.useForm();

	const { loading, error, message: successMessage } = useSelector(
		(state) => state.password
	);


	useEffect(() => {
		if (error) {
			message.error(error);
		}
		if (successMessage) {
			message.success("Please Check Your Mail");
			form.resetFields();
		}
	}, [error, successMessage, form]);

	const handleForgotPassword = (values) => {
		dispatch(forgotPassword(values.phone_number));
	};

	if (loading) {
		return <Loader />
	}

	return (
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
	);
};

export default ForgotPassword;



