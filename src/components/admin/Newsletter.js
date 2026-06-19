import React, { useState } from "react";
import { Form, Input, Button, message, Spin, Checkbox } from "antd";
import "./newsletter.css";
import Main from "./AdminLayout/AdminLayout";


const Newsletter = () => {
	const [form] = Form.useForm();
	const apiurl = process.env.REACT_APP_API_URL;
	const [loading, setLoading] = useState(false);

	const [compareArray,setCompareArray]=useState([]);

	const handleFinish = async (values) => {
		if (!values.send_email && !values.send_whatsapp) {
			message.error("Please select at least one channel (Email or WhatsApp).", 5);
			return;
		}
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
				const data = await response.json();
				message.error(data.error || "Failed to send Newsletter", 30);
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
					<Form
						form={form}
						layout="vertical"
						onFinish={handleFinish}
						initialValues={{ send_email: false, send_whatsapp: false }}
						className="newsletter-form">
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
						<Form.Item label="Send via">
							<Form.Item name="send_email" valuePropName="checked" noStyle>
								<Checkbox>Email</Checkbox>
							</Form.Item>
							<Form.Item name="send_whatsapp" valuePropName="checked" noStyle>
								<Checkbox style={{ marginLeft: "20px" }}>WhatsApp</Checkbox>
							</Form.Item>
						</Form.Item>
						<Form.Item style={{ marginTop: "24px" }}>
							<Button
								type="primary"
								htmlType="submit"
								className="newsletter-submit-btn"
								loading={loading}>
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
