import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import Layout from "../User/Layout";
import { useAuth } from "../utils/useAuth";
import Loader from "../Loader/Loader";

const ResetPasswordForm = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { apiurl, token, handleLogout } = useAuth();
	const [loading, setLoading] = useState(false);

	const handleSubmit = (values) => {
		setLoading(true);
		const currentPassword = values.currentPassword;
		const newPassword = values.newPassword;
		const confirmPassword = values.confirmPassword;

		fetch(`${apiurl}/changepassword/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				currentPassword,
				newPassword,
				confirmPassword,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					message.success("Password changed successfully.");
					navigate("/change/success");
					form.resetFields();
					handleLogout();
					setLoading(false);
				} else {
					setLoading(false);
					message.error(data.message);
				}
			})
			.catch((error) => {
				setLoading(false);
				message.error("An error occurred while changing the password.");
			});
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<>
			<div className="change-pass-form">
				<div>
					<Form
						form={form}
						className="form"
						layout="vertical"
						initialValues={{
							remember: true,
						}}
						onFinish={handleSubmit}
						autoComplete="off">
						<Form.Item
							label="Current Password"
							name="currentPassword"
							rules={[
								{
									required: true,
									message: "Please input your password!",
								},
							]}>
							<Input.Password className="inp" />
						</Form.Item>

						<Form.Item
							label="New Password"
							name="newPassword"
							rules={[
								{
									required: true,
									message: "Please input your password!",
								},
							]}>
							<Input.Password className="inp" />
						</Form.Item>

						<Form.Item
							label="Confirm New Password"
							name="confirmPassword"
							rules={[
								{
									required: true,
									message: "Please input your password!",
								},
							]}>
							<Input.Password className="inp" />
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								className="login-submit-btn">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</>
	);
};

export default ResetPasswordForm;
