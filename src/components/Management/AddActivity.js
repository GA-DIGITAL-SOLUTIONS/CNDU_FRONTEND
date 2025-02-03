import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, Form, Button, Input, message, Card } from "antd";
import { useAuth } from "../utils/useAuth";
import "./addactivity.css";
import Main from "./Layout";

const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

const AddActivity = () => {
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [fileList, setFileList] = useState([]);
	const [form] = Form.useForm();
	const formdata = new FormData();
	const { apiurl, token } = useAuth();

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};

	const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

	const uploadButton = (
		<div className="upload-button">
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

	const onFinish = async (values) => {
		// console.log("Form values:", values);
		formdata.append("name", values.name);
		formdata.append("date", values.date);
		formdata.append("description", values.description);
		formdata.append("start_time", values.start_time);
		formdata.append("end_time", values.end_time);
		formdata.append("location", values.location);
		fileList.forEach((file) => {
			if (file.originFileObj) {
				formdata.append("images", file.originFileObj);
			}
		});

		const response = await fetch(`${apiurl}/activities/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formdata,
		});
		if (response.ok) {
			const data = await response.json();
			message.success(data.message);
			form.resetFields();
      setFileList([]);
		}
	};

	return (
		<Main>
			<div className="activity-container">
				<div className="activity-card">
					<h2 className="form-title">Add New Activity</h2>
					<Form form={form} onFinish={onFinish} layout="vertical">
						<Form.Item name="name" label="Activity Name" className="form-item">
							<Input placeholder="Enter activity name" />
						</Form.Item>
						<Form.Item
							name="description"
							label="Description"
							className="form-item">
							<Input.TextArea
								rows={4}
								placeholder="Enter a description about the activity"
							/>
						</Form.Item>
						<Form.Item name="date" label="Date" className="form-item">
							<Input type="date" />
						</Form.Item>
						<Form.Item
							name="start_time"
							label="Start Time"
							className="form-item">
							<Input type="time" />
						</Form.Item>
						<Form.Item name="end_time" label="End Time" className="form-item">
							<Input type="time" />
						</Form.Item>
						<Form.Item name="location" label="Location" className="form-item">
							<Input placeholder="Enter the location" />
						</Form.Item>
						<Form.Item name="images" className="form-item">
							<Upload
								listType="picture-card"
								fileList={fileList}
								onPreview={handlePreview}
								onChange={handleChange}
								beforeUpload={() => false}>
								{fileList.length >= 8 ? null : uploadButton}
							</Upload>
						</Form.Item>
						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								className="submit-button">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>

			{previewImage && (
				<Image
					wrapperStyle={{ display: "none" }}
					preview={{
						visible: previewOpen,
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) => !visible && setPreviewImage(""),
					}}
					src={previewImage}
				/>
			)}
		</Main>
	);
};

export default AddActivity;
