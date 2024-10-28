import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Upload, Select } from "antd";
import { useAuth } from "../utils/useAuth";
import { useNavigate } from "react-router-dom";
import { InboxOutlined } from "@ant-design/icons";
import "./AddBooks.css";

const { Dragger } = Upload;
const { Option } = Select;

const AddBook = () => {
	const [form] = Form.useForm();
	const { apiurl, token } = useAuth();
	const navigate = useNavigate();
	const [file, setFile] = useState(null);
	const [categories, setCategories] = useState([]);
	const [loadingCategories, setLoadingCategories] = useState(true);

	
	const fetchCategories = async () => {
		try {
			const response = await fetch(`${apiurl}/getcategories/`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				
				setCategories(data.data || []);
				setLoadingCategories(false);
			} else {
				message.error("Failed to load categories.");
				setLoadingCategories(false);
			}
		} catch (error) {
			message.error("An error occurred while fetching categories.");
			setLoadingCategories(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleFileChange = (info) => {
		const { status, originFileObj } = info.file;
		if (status === "done") {
			setFile(originFileObj);
		} else if (status === "error") {
			message.error(info.file.error.message);
		}
	};

	const handleAddBooks = async (values) => {
		const formdata = new FormData();
		formdata.append("title", values.title);
		formdata.append("author", values.author);
		formdata.append("description", values.description);
		formdata.append("category", values.category); 
		formdata.append("image", file);
		formdata.append("num_of_copies", values.num_of_copies);
		formdata.append("preferredFromAge", values.preferredFromAge);
		formdata.append("preferredToAge", values.preferredToAge);

		try {
			const response = await fetch(`${apiurl}/books/`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formdata,
			});
			if (response.ok) {
				const data = await response.json();
				message.success(data.message);
				navigate("/inventory");
				form.resetFields();
			} else {
				const errorData = await response.json();
				message.error(errorData.message);
			}
		} catch (error) {
			console.error("Failed to add book:", error);
			message.error("An error occurred while adding the book.");
		}
	};

	const customRequest = ({ file, onSuccess }) => {
		setFile(file);
		onSuccess("ok");
	};

	return (
		<div className="add-books-container">
			<Form
				form={form}
				name="AddBooks"
				className="books-form"
				layout="vertical"
				onFinish={handleAddBooks}>
				<Form.Item
					name="title"
					label="Title"
					className="form-item"
					rules={[{ required: true, message: "Please enter a title" }]}>
					<Input placeholder="Enter Title" />
				</Form.Item>
				<Form.Item
					name="author"
					label="Author"
					className="form-item"
					rules={[{ required: true, message: "Please enter an author" }]}>
					<Input placeholder="Enter Author" />
				</Form.Item>
				<Form.Item
					name="description"
					label="Description"
					className="form-item"
					rules={[{ required: true, message: "Please enter a description" }]}>
					<Input.TextArea rows={4} placeholder="Enter Description" />
				</Form.Item>
				<Form.Item
					name="category"
					label="Category"
					className="form-item"
					rules={[{ required: true, message: "Please select a category" }]}>
					<Select
						mode="multiple"
						placeholder="Select Category"
						loading={loadingCategories}>
						{categories.length > 0
							? categories.map((category) => (
									<Option key={category.id} value={category.id}>
										{category.name}
									</Option>
							  ))
							: null}
					</Select>
				</Form.Item>
				<div className="form-group">
					<Form.Item
						name="num_of_copies"
						label="Number of Copies"
						rules={[
							{ required: true, message: "Please input number of copies." },
						]}
						className="form-item">
						<Input type="number" placeholder="Enter Number of Copies" />
					</Form.Item>
				</div>

				<Form.Item
					name="image"
					label="Image"
					className="form-item"
					rules={[{ required: true, message: "Please upload an image." }]}>
					<Dragger
						className="image-upload"
						accept=".png,.jpg,.jpeg"
						maxCount={1}
						onChange={handleFileChange}
						customRequest={customRequest}>
						<p className="ant-upload-drag-icon">
							<InboxOutlined />
						</p>
						<p className="ant-upload-text">
							Click or drag image to this area to upload
						</p>
						<p className="ant-upload-hint">Upload only image files</p>
					</Dragger>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" className="submit-button">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default AddBook;
