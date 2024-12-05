import React, { useState } from "react";
import {
	Button,
	Checkbox,
	Form,
	Input,
	InputNumber,
	Select,
	Spin,
	Upload,
} from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import Main from "./AdminLayout/AdminLayout";
import "./Addproduct.css";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../store/productsSlice";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;

const Addproduct = () => {
	const [colorFields, setColorFields] = useState([
		{ color_id: "", stock_quantity: 0, price: 0, images: [] },
	]);
    const navigate = useNavigate();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const { apiurl, access_token } = useSelector((state) => state.auth);

	const [form] = Form.useForm();

	const initialValues = {
		name: "",
		category_id: null,
		weight: 50.0,
		price: 0,
		stock_quantity: 0,
		colors: [],
		is_special_collection: false,
		description: "",
		product_type: "",
	};

	const handleAddProduct = () => {
		setLoading(true);
		form
			.validateFields()
			.then((values) => {
				const formData = new FormData();

				formData.append("name", values.name);
				formData.append("category_id", values.category_id);
				formData.append("weight", values.weight);
				formData.append("description", values.description);
				formData.append("is_special_collection", values.is_special_collection);

				if (values.category_id === 3) {
					formData.append("product_type", "fabric");
				} else {
					formData.append("product_type", "product");
				}

				const colors = colorFields.map((color) => ({
					color_id: color.color_id,
					stock_quantity: color.stock_quantity,
					price: color.price,
				}));
				formData.append("colors", JSON.stringify(colors));

				colorFields.forEach((color) => {
					color.images.forEach((image) => {
						formData.append(`images_${color.color_id}`, image);
					});
				});

				dispatch(addProduct({ formData, access_token }))
					.unwrap()
					.then(() => {
                        form.resetFields();
                        navigate('/inventory');
					})
					.catch((error) => {
						console.error("Error adding product:", error);
					});
			})
			.catch((info) => {
				console.log("Validation Failed:", info);
			});

		setLoading(false);
	};

	const handleImageChange = (e, index) => {
		const newColorFields = [...colorFields];
		newColorFields[index].images = e.fileList.map(
			(file) => file.originFileObj || file
		);
		setColorFields(newColorFields);
	};

	const handleAddColor = () => {
		setColorFields([
			...colorFields,
			{ color_id: "", stock_quantity: 0, price: 0, images: [] },
		]);
	};

	const handleRemoveColor = (index) => {
		const newColorFields = colorFields.filter((_, i) => i !== index);
		setColorFields(newColorFields);
	};

	if (loading) {
		return <Spin />;
	}

	return (
		<Main>
			<div className="add-product-container">
				<Form
					form={form}
					layout="vertical"
					initialValues={initialValues}
					className="add-product-form">
					<div className="form-grid">
						<div className="form-left">
							<Form.Item
								name="name"
								label="Product Name"
								className="form-item"
								rules={[
									{ required: true, message: "Please input the product name!" },
								]}>
								<Input placeholder="Enter product name" />
							</Form.Item>

							<Form.Item
								name="category_id"
								label="Category"
								className="form-item"
								rules={[
									{ required: true, message: "Please select the category!" },
								]}>
								<Select placeholder="Select a category">
									<Select.Option value={3}>Fabrics</Select.Option>
									<Select.Option value={4}>Sarees</Select.Option>
								</Select>
							</Form.Item>

							<Form.Item
								name="weight"
								label="Weight(in grams)"
								className="form-item"
								rules={[
									{
										required: true,
										message: "Please enter the weight of the product!",
									},
								]}>
								<InputNumber min={50} step={0.5} />
							</Form.Item>

							<Form.Item
								name="description"
								label="Description"
								className="form-item">
								<TextArea rows={4} placeholder="Enter product description" />
							</Form.Item>

							<Form.Item
								name="is_special_collection"
								valuePropName="checked"
								className="form-item">
								<Checkbox>Special Collection</Checkbox>
							</Form.Item>

							<Button
								type="primary"
								onClick={handleAddProduct}
								className="submit-button">
								Add Product
							</Button>
						</div>

						<div className="form-right">
							{colorFields.map((color, index) => (
								<div key={index} className="color-field">
									<div className="add-prod-header">
										<h4>Varient {index + 1}</h4>
										<Button
											danger
											onClick={() => handleRemoveColor(index)}
											className="remove-color-button">
											<DeleteOutlined />
										</Button>
									</div>
									<div className="color-field-space">
										<Form.Item
											label="Color"
											className="form-item"
											name={["colors", index, "color_id"]}
											rules={[
												{ required: true, message: "Please select a color!" },
											]}>
											<Select
												placeholder="Select color"
												value={color.color_id}
												onChange={(value) => {
													const newColorFields = [...colorFields];
													newColorFields[index].color_id = value;
													setColorFields(newColorFields);
												}}>
												<Select.Option value="1">Orange</Select.Option>
												<Select.Option value="2">Green</Select.Option>
												<Select.Option value="3">Violet</Select.Option>
												<Select.Option value="4">Red</Select.Option>
												<Select.Option value="5">Blue</Select.Option>
											</Select>
										</Form.Item>

										<Form.Item
											label="Stock Quantity"
											className="form-item"
											rules={[
												{ required: true, message: "Enter stock quantity" },
											]}>
											<InputNumber
												min={0}
												value={color.stock_quantity}
												onChange={(value) => {
													const newColorFields = [...colorFields];
													newColorFields[index].stock_quantity = value;
													setColorFields(newColorFields);
												}}
											/>
										</Form.Item>

										<Form.Item
											label="Price"
											className="form-item"
											rules={[{ required: true, message: "Enter price" }]}>
											<InputNumber
												min={0}
												step={0.01}
												value={color.price}
												onChange={(value) => {
													const newColorFields = [...colorFields];
													newColorFields[index].price = value;
													setColorFields(newColorFields);
												}}
											/>
										</Form.Item>
									</div>
									<Form.Item label="Upload Images" className="form-item">
										<Upload
											listType="picture-card"
											fileList={color.images}
											onChange={(e) => handleImageChange(e, index)}
											beforeUpload={() => false}>
											<UploadOutlined />
											Upload
										</Upload>
									</Form.Item>
								</div>
							))}

							<Button
								type="dashed"
								onClick={handleAddColor}
								className="add-color-button">
								Add Varient
							</Button>
						</div>
					</div>
				</Form>
			</div>
		</Main>
	);
};

export default Addproduct;
