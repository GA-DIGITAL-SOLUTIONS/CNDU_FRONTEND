import React, { useEffect, useState } from "react";
import {
	Button,
	Table,
	Modal,
	Form,
	Input,
	message,
	Popconfirm,
	Space,
} from "antd";
import { useAuth } from "../utils/useAuth";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;

const Categories = () => {
	const { apiurl, token } = useAuth(); 
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null); 
	const [isModalOpen, setIsModalOpen] = useState(false); 
	const [form] = Form.useForm();

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${apiurl}/getcategories/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setCategories(data.data);
			} else {
				message.error("Failed to fetch categories.");
			}
		} catch (error) {
			message.error("An error occurred while fetching categories.");
		} finally {
			setLoading(false);
		}
	};

	const handleAddEditCategory = async (values) => {
		try {
			const method = editingCategory ? "PUT" : "POST";
			const url = `${apiurl}/getcategories/`;

			const response = await fetch(url, {
				method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: editingCategory?.id,
					name: values.name,
				}),
			});

			if (response.ok) {
				const successMessage = editingCategory
					? "Category updated successfully."
					: "Category added successfully.";
				message.success(successMessage);
				fetchCategories(); 
				setIsModalOpen(false);
				form.resetFields();
				setEditingCategory(null);
			} else {
				const errorData = await response.json();
				message.error(errorData.error || "Failed to add/update category.");
			}
		} catch (error) {
			message.error("An error occurred while saving the category.");
		}
	};

	const handleDeleteCategory = async (id) => {
		confirm({
			title: "Are you sure you want to delete this category?",
			icon: <ExclamationCircleOutlined />,
			onOk: async () => {
				try {
					const response = await fetch(`${apiurl}/getcategories/`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ id }),
					});
					if (response.ok) {
						message.success("Category deleted successfully.");
						fetchCategories();
					} else {
						message.error("Failed to delete category.");
					}
				} catch (error) {
					message.error("An error occurred while deleting the category.");
				}
			},
		});
	};

	const showModal = (category = null) => {
		setEditingCategory(category);
		if (category) {
			form.setFieldsValue({ name: category.name });
		} else {
			form.resetFields();
		}
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		form.resetFields();
		setEditingCategory(null);
	};

	const columns = [
		{
			title: "Category Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Actions",
			key: "actions",
			render: (text, record) => (
				<Space size="middle">
					<Button type="link" onClick={() => showModal(record)}>
						Edit
					</Button>

					<Button
						type="link"
						danger
						onClick={() => handleDeleteCategory(record.id)}>
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<div>
			<div className="actions-container">
				<Button
					type="primary"
					className="add-button"
					onClick={() => showModal()}>
					Add Category
				</Button>
			</div>
			<Table
				dataSource={categories}
				columns={columns}
				rowKey="id"
				loading={loading}
				style={{ marginTop: 20 }}
			/>

			<Modal
				title={editingCategory ? "Edit Category" : "Add Category"}
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}>
				<Form form={form} layout="vertical" onFinish={handleAddEditCategory}>
					<Form.Item
						name="name"
						label="Category Name"
						rules={[
							{ required: true, message: "Please enter a category name" },
						]}>
						<Input placeholder="Enter category name" />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							{editingCategory ? "Update" : "Add"}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default Categories;
