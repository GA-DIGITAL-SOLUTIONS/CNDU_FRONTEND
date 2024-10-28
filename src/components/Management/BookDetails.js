import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import Main from "./Layout";
import { Button, Modal, Form, Input, message, Select } from "antd";
import { InboxOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import "./AddBooks.css";
import Dragger from "antd/es/upload/Dragger";

const { confirm } = Modal;
const { Option } = Select;

const AdminBookDetail = () => {
	const { id } = useParams();
	const { apiurl, token } = useAuth();
	const [book, setBook] = useState(null);
	const [editmodal, setEditModal] = useState(false);
	const [form] = Form.useForm();
	const [file, setFile] = useState(null);
	const [categories, setCategories] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchBookDetails();
		fetchCategories(); 
	}, []);

	const fetchBookDetails = async () => {
		try {
			const response = await fetch(`${apiurl}/getbook/${id}/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				
				const categoryIds = data.book.categories.map((category) => category.id);
				setBook({
					...data.book,
					categories: categoryIds, 
				});
			} else {
				console.error("Failed to fetch book details:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching book details:", error);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await fetch(`${apiurl}/getcategories/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setCategories(data.data); 
			} else {
				console.error("Failed to fetch categories:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	const handleEdit = () => {
		setEditModal(true);
	};

	const handleDelete = async () => {
		confirm({
			title: "Are you sure you want to delete this book?",
			icon: <ExclamationCircleOutlined />,
			okText: "Yes",
			okType: "danger",
			cancelText: "No",
			onOk: async () => {
				try {
					const response = await fetch(`${apiurl}/books/`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ id: id }),
					});
					if (response.ok) {
						message.success("Book deleted successfully");
						navigate("/inventory");
					} else {
						message.error("Failed to delete book");
					}
				} catch (error) {
					message.error(error);
				}
			},
		});
	};

	const handleFileChange = (info) => {
		const { status, originFileObj } = info.file;
		if (status === "done") {
			setFile(originFileObj);
		} else if (status === "error") {
			message.error(info.file.error.message);
		}
	};

	const customRequest = ({ file, onSuccess }) => {
		setFile(file);
		onSuccess("ok");
	};

	const handleEditBook = async (values) => {
		const formdata = new FormData();
		formdata.append("title", values.title);
		formdata.append("id", id);
		formdata.append("author", values.author);
		
		formdata.append("category", values.category.join(",")); 
		formdata.append("description", values.description);
		formdata.append("num_of_copies", values.num_of_copies);
		formdata.append("image", file);

		try {
			const response = await fetch(`${apiurl}/books/`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formdata,
			});
			if (response.ok) {
				const data = await response.json();
				message.success(data.message);
				setEditModal(false);
				fetchBookDetails();
			} else {
				message.error("Failed to update book");
			}
		} catch (error) {
			message.error("An error occurred");
		}
	};

	return (
		<Main>
			<div className="admin-book-detail">
				<img
					style={{ width: "200px" }}
					src={`${apiurl}${book?.image}`}
					alt={book?.title}
				/>
				<div>
					<div className="title">{book?.title}</div>
					<div className="author">
						<span>Author: </span>
						{book?.author}
					</div>
					<div className="author">
						<span>Category: </span>
						{book?.categories
							?.map((catId) => {
								const category = categories.find((c) => c.id === catId);
								return category ? category.name : null;
							})
							.join(", ")}{" "}
					</div>
					<div className="available-count">
						<span>Available: </span>
						{book?.num_of_copies}
					</div>
					<div className="desc">{book?.description}</div>
					<div className="book-admin-actions">
						<Button type="dashed" onClick={handleEdit}>
							Edit
						</Button>
						<Button type="dashed" danger onClick={handleDelete}>
							Delete
						</Button>
					</div>
				</div>
			</div>

			<Modal
				title="Edit Book"
				open={editmodal}
				onCancel={() => setEditModal(false)}
				footer={null}>
				<Form
					form={form}
					name="EditBook"
					layout="vertical"
					initialValues={{
						...book,
						categories: book?.categories || [],
					}}
					onFinish={handleEditBook}>
					<Form.Item
						name="title"
						label="Title"
						rules={[{ required: true, message: "Please enter a title" }]}>
						<Input placeholder="Enter Title" />
					</Form.Item>
					<Form.Item
						name="author"
						label="Author"
						rules={[{ required: true, message: "Please enter an author" }]}>
						<Input placeholder="Enter Author" />
					</Form.Item>
					<Form.Item
						name="description"
						label="Description"
						rules={[{ required: true, message: "Please enter a description" }]}>
						<Input.TextArea placeholder="Enter Description" />
					</Form.Item>
					<Form.Item
						name="category"
						label="Category"
						rules={[{ required: true, message: "Please select a category" }]}>
						<Select placeholder="Select Category" mode="multiple" allowClear>
							{categories.map((cat) => (
								<Option key={cat.id} value={cat.id}>
									{cat.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name="num_of_copies" label="Number of Copies">
						<Input type="number" placeholder="Enter Number of copies" />
					</Form.Item>
					<Form.Item name="image" label="Image">
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
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</Main>
	);
};

export default AdminBookDetail;
