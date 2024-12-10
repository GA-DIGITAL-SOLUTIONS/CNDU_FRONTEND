import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	Button,
	Card,
	Col,
	Row,
	Modal,
	Form,
	Input,
	Select,
	Space,
	InputNumber,
	Upload,
	Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
	deleteProduct,
	fetchProducts,
	updateProduct,
} from "../../store/productsSlice";
import { Link } from "react-router-dom";
import Main from "./AdminLayout/AdminLayout";

const ProductPage = () => {
	const navigate = useNavigate();
	const { access_token, apiurl } = useSelector((state) => state.auth);
	const [singleproduct, setSingleProduct] = useState({});
	const { id } = useParams();
	const dispatch = useDispatch();
	const { loading, error } = useSelector((state) => state.products);
	const [colorFields, setColorFields] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		const url = apiurl;
		fetchProductId({ id, url });
	}, [id, apiurl]);

	const fetchProductId = async ({ id, url }) => {
		try {
			const response = await fetch(`${url}/products/${id}`);
			if (!response.ok) {
				throw new Error(`Error: ${response.status} - ${response.statusText}`);
			}
			const data = await response.json();
			setSingleProduct(data);
		} catch (err) {
		} finally {
		}
	};

	const product = singleproduct;
	useEffect(() => {
		if (singleproduct) {
			const initialColors = singleproduct.product_colors?.map((color) => ({
				color_id: color.color.id,
				stock_quantity: color.stock_quantity,
				price: color.price,
				images: color.images.map((image) => ({
					uid: image.id,
					name: image.image.split("/").pop(),
					url: `${apiurl}${image.image}`,
					originFileObj: null,
				})),
			}));
			setColorFields(initialColors || []);
			form.setFieldsValue({
				name: singleproduct.name,
				category_id: singleproduct.category?.id || null,
				weight: singleproduct.weight || null,
				colors: initialColors,
				is_special_collection: singleproduct.is_special_collection || false,
				description: singleproduct.description || "",
			});
		}
	}, [singleproduct, apiurl, form]);

	const handleEdit = () => setIsModalVisible(true);
	const handleCancel = () => setIsModalVisible(false);

	const handleAddColor = () => {
		setColorFields([
			...colorFields,
			{ color_id: null, stock_quantity: 0, price: 0, images: [] },
		]);
	};

	const handleRemoveColor = (index) => {
		const updatedColors = [...colorFields];
		updatedColors.splice(index, 1);
		setColorFields(updatedColors);
	};

	const handleImageChange = (e, index) => {
		const updatedColors = [...colorFields];
		updatedColors[index].images = e.fileList;
		setColorFields(updatedColors);
	};

	const handleUpdateProduct = () => {
		form.validateFields().then(async (values) => {
			const formData = new FormData();

			formData.append("name", values.name);
			formData.append("category_id", values.category_id);
			formData.append("weight", values.weight);
			formData.append("is_special_collection", values.is_special_collection);
			formData.append("description", values.description);

			const colors = await Promise.all(
				colorFields.map(async (color, index) => {
					const imageFiles = await Promise.all(
						color.images.map(async (image) => {
							if (image.originFileObj) {
								return image.originFileObj;
							} else if (image.url) {
								const response = await fetch(image.url);
								const blob = await response.blob();
								return new File(
									[blob],
									image.name || `existing_image_${index}`,
									{ type: blob.type }
								);
							}
							return null;
						})
					);

					imageFiles.forEach((file, idx) => {
						if (file) formData.append(`images_${color.color_id}`, file);
					});

					return {
						color_id: color.color_id,
						stock_quantity: color.stock_quantity,
						price: color.price,
					};
				})
			);

			formData.append("colors", JSON.stringify(colors));

			dispatch(updateProduct({ id, formData, access_token }))
				.unwrap()
				.then(() => {
					setIsModalVisible(false);
					console.log("Product updated successfully");
				})
				.catch((error) => console.error("Error updating product:", error));
		});
	};

	const handleDelete = () => {
		dispatch(deleteProduct({ id, access_token }))
			.unwrap()
			.then(() => {
				console.log("Product deleted successfully");
				dispatch(fetchProducts());
				navigate("/inventory");
			})
			.catch((error) => console.error("Error deleting product:", error));
	};

	if (loading) return <p>Loading product details...</p>;
	if (error) return <p>Error: {error}</p>;

	const primaryImage = singleproduct.product_colors?.find(
		(colorObj) => colorObj.images.length > 0
	)?.images[0]?.image;

	return (
		<Main>
			<h1>Product page</h1>
			<Row gutter={[16, 16]}>
				<Col key={product.id} xs={24} sm={12} md={8} lg={6}>
					<Card hoverable>
						<Link to={`/inventory/product/${product.id}`}>
							{}
							<img
								src={`${apiurl}${primaryImage}`}
								alt={product.name}
								style={{
									width: "100%",
									height: "200px",
									objectFit: "cover",
								}}
							/>
						</Link>
						<Card.Meta
							title={
								<Link to={`/inventory/product/${product.id}`}>
									{product.name}
								</Link>
							}
							description={
								<>
									<p>Category: {product.category?.name || "N/A"}</p>
									{product.sub_category?.name && (
										<p>Sub-category: {product.sub_category.name}</p>
									)}
									<p>Available Colors:</p>
									<ul>
										{product.product_colors?.map((colorObj) => (
											<li key={colorObj.id}>
												<strong>{colorObj.color.name}</strong> - Price: ₹
												{colorObj.price}, Stock: {colorObj.stock_quantity}
												-images-{colorObj.images.length}
												{colorObj.images?.map((image, index) => (
													<div key={image.id || `${colorObj.id}-${index}`}>
														<img
															src={`${apiurl}${image.image}`}
															alt={`${product.name}-color:${colorObj.color.name} `}
															style={{
																width: "25%",
																height: "auto",
																objectFit: "cover",
															}}
														/>
													</div>
												))}
											</li>
										))}
									</ul>
								</>
							}
						/>
						<Button
							type="primary"
							onClick={handleEdit}
							style={{ marginRight: "10px" }}>
							Edit
						</Button>
						<Button type="danger" danger onClick={handleDelete}>
							Delete
						</Button>
					</Card>
				</Col>
			</Row>

			<Modal
				title="Edit Product"
				visible={isModalVisible}
				onOk={handleUpdateProduct}
				onCancel={handleCancel}>
				<Form form={form} layout="vertical">
					<Form.Item
						name="name"
						label="Product Name"
						rules={[
							{ required: true, message: "Please input the product name!" },
						]}>
						<Input />
					</Form.Item>
					<Form.Item
						name="category_id"
						label="Category"
						rules={[{ required: true, message: "Please select a category!" }]}>
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

					<Form.Item name="is_special_collection" valuePropName="checked">
						<Checkbox>Special Collection</Checkbox>
					</Form.Item>

					{colorFields.map((color, index) => (
						<Space key={index} direction="vertical" style={{ width: "100%" }}>
							<Form.Item label="Color" name={["colors", index, "color_id"]}>
								<Select placeholder="Select color">
									<Select.Option value="1">Orange</Select.Option>
									<Select.Option value="2">Green</Select.Option>
									<Select.Option value="3">Violet</Select.Option>
									<Select.Option value="4">Red</Select.Option>
									<Select.Option value="5">Blue</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item
								label="Stock Quantity"
								name={["colors", index, "stock_quantity"]}>
								<InputNumber />
							</Form.Item>
							<Form.Item label="Price" name={["colors", index, "price"]}>
								<InputNumber />
							</Form.Item>
							<Form.Item label="Images">
								<Upload
									listType="picture-card"
									fileList={color.images}
									onChange={(e) => handleImageChange(e, index)}
									beforeUpload={() => false}>
									<UploadOutlined />
								</Upload>
							</Form.Item>

							<Button type="danger" onClick={() => handleRemoveColor(index)}>
								Remove Color
							</Button>
						</Space>
					))}
					<Button type="dashed" onClick={handleAddColor}>
						Add Color
					</Button>

					<Form.Item name="description" label="Description">
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</Main>
	);
};

export default ProductPage;
