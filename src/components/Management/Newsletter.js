import React, { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { useAuth } from "../utils/useAuth";
import "./newsletter.css";
import Main from "./Layout";

const Newsletter = () => {
	const [form] = Form.useForm();
	const { apiurl } = useAuth();
	const [loading, setLoading] = useState(false);

	const handleFinish = async (values) => {
		setLoading(true);

		try {
			const response = await fetch(`${apiurl}/sendnewsletter/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (response.ok) {
				const data = await response.json();
				message.success(data.success, 30);
				form.resetFields();
			} else {
				message.error("Failed to send Newsletter", 30);
			}
		} catch (error) {
			message.error("An error occurred while sending the newsletter.", 30);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Main>
			<div className="main-div">
				<Spin spinning={loading}>
					<Form form={form} layout="vertical" onFinish={handleFinish} className="newsletter-form">
						<h1 className="newsletter-title">Send Newsletter</h1>
						<Form.Item
							label="Subject"
							name="subject"
							rules={[{ required: true, message: "Please enter the subject" }]}>
							<Input />
						</Form.Item>
						<Form.Item
							label="Content"
							name="content"
							rules={[{ required: true, message: "Please enter the content" }]}>
							<Input.TextArea rows={4} />
						</Form.Item>
						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								className="newsletter-submit-btn"
								loading={loading} 
							>
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Spin>
			</div>
		</Main>
	);
};

export default Newsletter;
