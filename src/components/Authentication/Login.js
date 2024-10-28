import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import "./login.css";
import { useAuth } from "../utils/useAuth";
import { useNavigate, Link } from "react-router-dom";
import img from "./../../images/loginbanner.png";
import logo from "./../../images/logo.png";
import Loader from "../Loader/Loader";

const Login = () => {
	const { apiurl,handleLogin } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const onFinish = async (values) => {
		setIsLoading(true);
		const response = await fetch(`${apiurl}/login/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		setIsLoading(false);

		if (response.ok) {
			const data = await response.json();
			handleLogin(data.access_token, data.data.role);
			message.success("Logged in Successfully");
			if (data.data.role === "admin") {
				navigate("/admin/home");
				window.location.reload();
			} else if (data.data.role === "user") {
				navigate("/");
				window.location.reload();
			}
		} else {
			const data = await response.json();
			message.error(data.error);
		}
	};

	const [form] = Form.useForm();

	if(isLoading){
		<Loader />;
	}

	return (
		<>
			<div className="login-loginpage">
				<div className="left-sec">
					<div className="top-section">
						<img src={logo} alt="Logo" />
					</div>
					<div>
						<Form
							form={form}
							title="Login"
							layout="vertical"
							className="form"
							onFinish={onFinish}>
							<h1>Welcome Back</h1>
							<p>Login into your account</p>
							<Form.Item
								name="phone_number"
								label="Phone Number"
								rules={[
									{
										required: true,
										message: "Please input your mobile number!",
									},
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								name="password"
								label="Password"
								rules={[
									{
										required: true,
										message: "Please input your password",
									},
								]}>
								<Input.Password className="pwd" />
							</Form.Item>

							<div className="login-forgot-link">
								<Link to="/forgot">Forgot Password</Link>
							</div>
							<Form.Item>
								<Button
									className="login-submit-btn"
									type="primary"
									htmlType="submit"
									loading={isLoading}
									disabled={isLoading}>
									Log In -&gt;
								</Button>
							</Form.Item>
						</Form>
					</div>
					<div className="login-signup-btn">
						Doesn't have an account? <Link to="/signup">Sign Up</Link>
					</div>
				</div>
				<div className="right-sec">
					<img className="login-banner-img" src={img} alt="img" />
				</div>
			</div>
		</>
	);
};

export default Login;
