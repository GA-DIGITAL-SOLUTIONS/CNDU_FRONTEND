import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";

import Loader from "../Loader/Loader";
import img from "./../../images/forgotpassbanner.png";
import logo from "./../../images/logo.png";
import "./styles.css";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../store/password/passwordSlice";

const ForgotPassword = () => {
	const dispatch = useDispatch();

	const apiurl = process.env.REACT_APP_API_URL;

// const	access_token= sessionStorage.getItem("access_token") 
//  const role= sessionStorage.getItem("userRole") // Store user role from session

 const { uidb64, token } = useParams();

	// Accessing state from Redux slice
	const { loading, error } = useSelector((state) => state.password);

	const [form] = Form.useForm();

	const handleSubmit = (values) => {

		if (values.password !== values.confirmPassword) {
			message.error("Passwords do not match");
			return;
		}

		// Dispatch resetPassword action with payload
		const response=dispatch(resetPassword({ uidb64, token, password: values.password }));
		console.log("here success msg ")
		console.log(response)
	};
	useEffect(() => {
		if (error) {
			message.error(error);
		}
	}, [error]);

	return loading ? (
		<Loader />
	) : (
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
					initialValues={{ remember: true }}
					onFinish={ handleSubmit}
					autoComplete="off"
				>
					<h1>Reset Password</h1>
					<Form.Item
						label="Password"
						name="password"
						rules={[
							{ required: true, message: "Please input your password!" },
						]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item
						label="Confirm Password"
						name="confirmPassword"
						rules={[
							{ required: true, message: "Please confirm your password!" },
						]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item>
						<Button className="login-submit-btn" type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default ForgotPassword;
