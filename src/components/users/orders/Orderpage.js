import React, { useState, useEffect } from "react";
import { fetchOrderById, removeOrderItem } from "../../../store/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

import Card from "antd/es/card/Card";
import {
	Col,
	Row,
	Table,
	Select,
	Button,
	Checkbox,
	Modal,
	message,
	Popconfirm,
	Rate,
	Upload,
} from "antd";
import Heading from "../Heading/Heading";
import { updateOrderStatus } from "../../../store/orderSlice";
import { removeOrder } from "../../../store/orderSlice";
import Banner from "./images/productpageBanner.png";
import "./Orderpage.css";
import { returnOrder } from "../../../store/orderSlice";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import Loader from "../../Loader/Loader";
import TextArea from "antd/es/input/TextArea";
import OrderStatus from "./OrderStatus";
import PrintInvoiceButton from "../../utils/DownloadInvoice";

const { Option } = Select;

const Orderpage = () => {
	const { id } = useParams();
	const { apiurl, access_token } = useSelector((state) => state.auth);
	const { SingleOrder, SingleOrderloading, SingleOrdererror } = useSelector(
		(state) => state.orders
	);
	const dispatch = useDispatch();
	const [returnarray, setReturnArray] = useState([]);
	const [orderStatus, setOrderStatus] = useState(SingleOrder?.status);
	const [date, setDate] = useState(null);
	const [textarea, setTextarea] = useState("");
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
	const [reviewRating, setReviewRating] = useState(0);
	const [reviewText, setReviewText] = useState("");
	const [selectedProductId, setSelectedProductId] = useState(null);
	const [fileList, setFileList] = useState([]);
	const [fetchedReviewsLoading, setFetchedReviewsLoading] = useState(false);
	const [fetchedReviews, setFetchedReviews] = useState([]);
	const [fetchedReviesIds, setfetchedReviewsIds] = useState([]);
	const [tracking, setTracking] = useState(null);
	const [order,setOrder] = useState(null)
	const [itemIds, setItemIds] = useState([]);

	useEffect(() => {
		const orderId = id;
		dispatch(fetchOrderById({ apiurl, access_token, orderId }));
	}, [dispatch, apiurl, id]);

	useEffect(() => {
		if (SingleOrder && SingleOrder.items) {
			const ids = SingleOrder.items.map((item) => item.item.id);

			setItemIds(ids);

			console.log("Item IDs: ", ids);
		}
	}, [SingleOrder]); //

	useEffect(() => {
		const createdAt = SingleOrder?.created_at;
		if (createdAt) {
			const dateObj = new Date(createdAt);
			const date = dateObj.toISOString().split("T")[0];
			const time = dateObj.toTimeString().split(" ")[0].slice(0, 5);
			setDate(date);
		}
	}, [date]);

	console.log("SingleOrder", SingleOrder);

	useEffect(() => {
		if (itemIds.length > 0) {
			const fetchReviews = async () => {
				const reviews = []; // Temporary array to hold reviews

				for (let i = 0; i < itemIds.length; i++) {
					try {
						const response = await fetch(
							`${apiurl}/fetchuserreviews/${itemIds[i]}`,
							{
								method: "GET",
								headers: {
									Authorization: `Bearer ${access_token}`,
									"Content-Type": "application/json",
								},
							}
						);
						const data = await response.json();

						// Store the item ID and the fetched data as an object
						reviews.push({
							itemId: itemIds[i],
							data: data,
						});
					} catch (error) {
						console.log(`There is no review for itemId ${itemIds[i]}:`);
						console.error(
							`Failed to fetch review for itemId ${itemIds[i]}:`,
							error
						);
					}
				}

				setFetchedReviews(reviews);
			};

			fetchReviews();
		}
	}, [itemIds, apiurl]);

	// console.log("fetchedReviews", fetchedReviews);
	// console.log("all ids  id", itemIds);

	// console.log("fetchedreview ids ", fetchedReviesIds);

	const handleStatusChange = (value) => {
		setOrderStatus(value);
	};

	const handleCheckboxChange = (e, id) => {
		if (e.target.checked) {
			setReturnArray((prev) => [...prev, id]);
		} else {
			setReturnArray((prev) => prev.filter((itemId) => itemId !== id));
		}
	};
	const handleChangeClick = () => {
		const UpdatedStatus = orderStatus;
		dispatch(
			updateOrderStatus({
				apiurl,
				access_token,
				UpdatedStatus,
				orderId: SingleOrder.id,
			})
		)
			.unwrap()
			.then(() => {
				const orderId = id;
				dispatch(fetchOrderById({ apiurl, access_token, orderId }));
			});
	};

	const handleCancelOrder = () => {
		dispatch(removeOrder({ apiurl, access_token, orderId: id }))
			.unwrap()
			.then(() => {
				const orderId = id;
				dispatch(fetchOrderById({ apiurl, access_token, orderId }));
			});
	};

	const handletextchange = (e) => {
		setTextarea(e.target.value);
	};

	const handleReturnOrder = () => {
		// console.log("textarea", textarea);
		if (returnarray.length > 0) {
			if (!textarea == "") {
				const array = JSON.stringify(returnarray);
				dispatch(returnOrder({ apiurl, access_token, array, textarea }))
					.unwrap()
					.then(() => {
						const orderId = id;
						dispatch(fetchOrderById({ apiurl, access_token, orderId }));
						setIsModalVisible(false);
					});
			} else {
				message.error("Please mention return reason.");
			}
		} else {
			message.error("Please select at least one item to return.");
		}
	};

	const handleCancelEachItem = (itemid) => {
		const orderId = itemid;
		dispatch(removeOrderItem({ apiurl, access_token, orderId }))
			.unwrap()
			.then(() => {
				const orderId = id;
				dispatch(fetchOrderById({ apiurl, access_token, orderId }));
				setIsModalVisible(false);
			});
	};

	const dataSource = SingleOrder.items
		? SingleOrder.items.map((item) => ({
			key: item.id,
			product: item.item,
			id: item.id,
			quantity: item.quantity,
			price: item.total_price,
			// reviewid: item.item.id,
			totalorderstatus: item.status,
		}))
		: []; //SingleOrder

	const dataSource2 = SingleOrder.items
		? SingleOrder.items.map((item) => ({
			key: item.id,
			product: item.item,
			id: item.id,
			quantity: item.quantity,
			price: item.total_price,
		}))
		: []; //SingleOrder

	const totalRow = {
		key: "total",
		product: "Total Order Amount",
		quantity: "",
		price: SingleOrder.total_order_price || 0,
	};

	const columns2 = [
		{
			title: "Product",
			dataIndex: "product",
			key: "product",
			width: 250,
			render: (product, record) => {
				if (record.key === "total") {
					return <strong>{product}</strong>;
				}
				const firstImage =
					product.images?.[0]?.image || "https://via.placeholder.com/80";
				return (
					<Row
						className="specific-order-item"
						style={{ display: "flex", alignItems: "center", gap: "16px" }}>
						<Col>
							<img
								src={`${apiurl}${firstImage}`}
								alt={product.product}
								className="specific-order-item-image"
								style={{
									width: "60px",
									height: "60px",
									objectFit: "cover",
									borderRadius: "8px",
									border: "1px solid #ddd",
								}}
							/>
						</Col>
						<Col style={{ flex: 1 }}>
							<p style={{ fontWeight: "bold", margin: 0 }}>{product.product}</p>
							<p style={{ fontWeight: "bold", margin: 0 }}>
								color: {product.color?.name}
							</p>
						</Col>
					</Row>
				);
			},
		},
		{
			title: "Action",
			dataIndex: "id",
			key: "id",
			render: (id) => {
				return (
					<Checkbox
						className={`checkbox ${returnarray.includes(id) ? "checkbox-checked" : ""
							}`}
						onChange={(e) => handleCheckboxChange(e, id)}
						checked={returnarray.includes(id)}
					/>
				);
			},
		},
	];

	const columns = [
		{
			title: "Product",
			dataIndex: "product",
			key: "product",
			width: 250,
			render: (product, record) => {
				if (record.key === "total") {
					return <strong>{product}</strong>;
				}
				const firstImage =
					product.images?.[0]?.image || "https://via.placeholder.com/80";
				return (
					<Row
						className="specific-order-product-row"
						style={{ display: "flex", alignItems: "center", gap: "16px" }}>
						<Col>
							<img
								src={`${apiurl}${firstImage}`}
								alt={product.product}
								className="specific-order-product-image"
								style={{
									width: "60px",
									height: "60px",
									objectFit: "cover",
									borderRadius: "8px",
									border: "1px solid #ddd",
								}}
							/>
						</Col>
						<Col style={{ flex: 1 }}>
							<p style={{ fontWeight: "bold", margin: 0 }}>{product.product}</p>
							<p style={{ fontWeight: "bold", margin: 0 }}>
								color: {product.color?.name}
							</p>
						</Col>
					</Row>
				);
			},
		},
		{
			title: "Quantity",
			dataIndex: "quantity",
			key: "quantity",
			render: (quantity, record) => {
				return record.key === "total" ? null : <p>{quantity}</p>;
			},
		},
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
			render: (price) => {
				return <p>{price}</p>;
			},
		},
	];

	useEffect(() => {
		const isTotalOrderStatus = SingleOrder?.status === "delivered";
	}, [SingleOrder]);

	const handlereviewModel = (reviewid) => {
		setIsReviewModalVisible(true);
		setSelectedProductId(reviewid);
	};

	// const fetchOrder = async () => {
	// 	try {
	// 		const response = await fetch(`${apiurl}/orders/${id}/`, {
	// 			method: 'GET',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				'Authorization': `Bearer ${access_token}`,
	// 			},
	// 		});

	// 		if (!response.ok) {
	// 			throw new Error('Failed to fetch order by ID');
	// 		}
	// 		const response2 = await response.json();
	// 		setOrder(response2.data)
	// 		console.log("Order details ", response2.data)
	// 	} catch (error) {
	// 		console.error("Order not found ",error ) // Return error message on failure
	// 	}
	// }

	const fetchTracking = async () => {
		try {
			const response = await fetch(`${apiurl}/trackorder?order_id=${id}`);
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			const data = await response.json();
			console.log("tracking data", data);
			setTracking(data?.data);
		} catch (error) {
			console.error("Error fetching tracking data:", error);
		}
	};

	useEffect(() => {
		if (id) {
			// fetchOrder();
			fetchTracking();
		}
	}, [id]);

	const handleReviewSubmit = () => {
		const formData = new FormData();

		formData.append("id", selectedProductId);
		formData.append("review", reviewText);
		formData.append("rating", reviewRating);

		fileList.forEach((file) => {
			formData.append("images", file.originFileObj);
		});

		fetch(`${apiurl}/reviews/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				setIsReviewModalVisible(false);
				dispatch(fetchOrderById({ apiurl, access_token, orderId: id }));
				message.success(data.message);
			})
			.catch((err) => {
				console.error("Error submitting review:", err);
				message.error("Failed to submit review. Please try again.");
			});
	};

	// const fetchReviews = async () => {
	// 	setFetchedReviewsLoading(true);
	// 	try {
	// 		const response = await fetch(`${apiurl}/reviews`, {
	// 			method: "GET",
	// 			headers: {
	// 				Authorization: `Bearer ${access_token}`,
	// 				"Content-Type": "application/json",
	// 			},
	// 		});
	// 		const data = await response.json();
	// 		setFetchedReviews(data);
	// 	} catch (error) {
	// 		message.error("Failed to fetch reviews.");
	// 	} finally {
	// 		setFetchedReviewsLoading(false);
	// 	}
	// };

	if (SingleOrderloading) {
		return <Loader />;
	}

	const handleImageUpload = (info) => {
		// console.log("info", info);
		let newFileList = [...info.fileList];
		newFileList = newFileList.slice(-5);

		setFileList(newFileList);

		if (info.file.status === "done") {
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === "error") {
			message.error(`${info.file.name} file upload failed.`);
		}
	};
	const beforeUpload = (file) => {
		const isImage = file.type.startsWith("image/");
		if (!isImage) {
			message.error("You can only upload image files!");
		}
		return isImage;
	};

	const nonMatchingItemIds = itemIds.filter((itemId) => {
		return !fetchedReviews.some((review) => review.itemId === itemId);
	});

	// console.log("nonMatchingItemIds", nonMatchingItemIds);
	return (
		<>
			<div className="specific-order-container">
				<img className="specific-order-banner" src={Banner} alt="Banner" />
				<div className="specific-order-content">
					<Breadcrumb>
						<Breadcrumb.Item>
							<Link to={"/"}>Home</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>
							<Link to={"/profile"}>Orders</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>Order Details</Breadcrumb.Item>
					</Breadcrumb>
					<div className="od-head">
						<div>
							<h4 className="specific-order-id">Order id: {tracking?.orderNumber}</h4>
							<h4 className="specific-order-id">
								Order Status: {tracking?.orderStatus}
							</h4>
						</div>
						<PrintInvoiceButton orderId={SingleOrder?.id} />
					</div>

					<OrderStatus
						orderStatus={tracking?.orderStatus}
						trackingDetails={tracking?.trackingDetails}
						orderNumber={tracking?.orderNumber || id}
					/>

					<div className="specific-order-table">
						<div className="specific-order-items">
							<div>
								{SingleOrder.items &&
									SingleOrder.items.map((item) => (
										<div key={item.id} className="specific-order-item">
											<div className="single-order-header">
												<img
													className="single-order-img"
													src={`${apiurl}${item.item.images?.[0]?.image ||
														"https://via.placeholder.com/80"
														}`}
													alt={item.item.product}
												/>
												<div className="prod-desc">
													<div className="prod-name">{item.item.product}</div>
													<div className="single-order-meta">
														<p>Color: {item.item.color?.name}</p>
														<p>Quantity: {item.quantity}</p>
														<p>Price: {item.total_price}</p>
													</div>
												</div>
												<div></div>

												{nonMatchingItemIds.includes(item.item.id) &&
													SingleOrder.status === "delivered" && (
														<Button
															className="specific-order-review-button"
															type="primary"
															danger
															onClick={() => handlereviewModel(item.item.id)}>
															Add Review
														</Button>
													)}
												{SingleOrder.status === "delivered" &&
													fetchedReviews.map((review) => {
														if (review.itemId === item.item.id) {
															return (
																<div key={review.itemId}>
																	<Rate value={review.data.rating} disabled />
																</div>
															);
														}
														return null; // Return null if no match
													})}
											</div>
										</div>
									))}

								<div className="specific-order-total">
									<p>
										<span className="label">Actual Amount:</span>
										<span className="value">
											₹{SingleOrder?.total_order_price || 0}
										</span>
									</p>
									{SingleOrder?.total_order_price >
										SingleOrder?.total_discount_price && (
											<p>
												<span className="label">Discount Amount:</span>
												<span className="value">
													- ₹{SingleOrder?.total_order_price -
														SingleOrder?.total_discount_price}
												</span>
											</p>
										)}
									<p>
										<span className="label">Delivery Charge:</span>
										<span className="value">
											+ ₹{Number(SingleOrder?.shipping_charges)}
										</span>
									</p>
									<p>
										<span className="label">Total Paid:</span>
										<span className="value">
											₹{Number(SingleOrder?.total_discount_price) +
												Number(SingleOrder?.shipping_charges)}
										</span>
									</p>
								</div>

								<div className="specific-order-buttons">
									{SingleOrder.status === "delivered" && (
										<Button
											type="primary"
											onClick={() => setIsModalVisible(true)}>
											Return Order
										</Button>
									)}
									{(SingleOrder.status === "pending" ||
										SingleOrder.status === "shipped") && (
											<Popconfirm
												title="Are you sure you want to cancel the entire order?"
												onConfirm={handleCancelOrder}
												okText="Yes"
												cancelText="No">
												<Button type="primary" style={{ width: "150px" }} danger>
													Cancel Order
												</Button>
											</Popconfirm>
										)}
								</div>
							</div>
						</div>
					</div>
					<div className="specific-order-actions">
						<div className="specific-order-address">
							<h3 className="specific-order-address-title">Delivery Address</h3>
							<p>
								<strong>Address:</strong>{" "}
								{SingleOrder?.shipping_address?.address}
							</p>
							<p>
								<strong>City:</strong> {SingleOrder?.shipping_address?.city}
							</p>
							<p>
								<strong>Pincode:</strong>{" "}
								{SingleOrder?.shipping_address?.pincode}
							</p>
							<p>
								<strong>State:</strong> {SingleOrder?.shipping_address?.state}
							</p>
						</div>
						<div></div>
					</div>
				</div>
			</div>

			<Modal
				title="Return Order"
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}>
				<div>
					<Table
						className="specific-order-return-table"
						dataSource={dataSource2}
						columns={columns2}
						rowKey="id"
						pagination={false}
					/>
					<textarea
						placeholder="Enter your reason here..."
						rows="6"
						value={textarea}
						onChange={handletextchange}
						className="specific-order-reason-textarea"
					/>
					<Button
						type="primary"
						size="middle"
						onClick={handleReturnOrder}
						loading={isSubmitting}
						style={{
							marginTop: "10px",
							backgroundColor: "yellowgreen",
						}}>
						Submit Request
					</Button>
				</div>
			</Modal>

			<Modal
				open={isReviewModalVisible}
				onCancel={() => setIsReviewModalVisible(false)}
				onOk={handleReviewSubmit}
				title="Add Your Review">
				<Rate
					value={reviewRating}
					allowHalf
					onChange={setReviewRating}
					className="specific-order-rating"
				/>
				<TextArea
					value={reviewText}
					onChange={(e) => setReviewText(e.target.value)}
					placeholder="Write your review here..."
					rows={4}
					className="specific-order-review-textarea"
				/>
				<Upload
					beforeUpload={() => false}
					onChange={handleImageUpload}
					listType="picture"
					multiple
					maxCount={5}
					className="specific-order-upload">
					<Button icon={<UploadOutlined />}>Upload Images</Button>
				</Upload>
			</Modal>
		</>
	);
};

export default Orderpage;
