import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFabrics } from "../../../store/productsSlice";
import productpageBanner from "./images/productpageBanner.png";
import sareevideo from "./images/sareevideo.mp4";
import uparrow from "./images/uparrow.svg";
import downarrow from "./images/uparrow.svg";
import commentsicon from "./images/comments.svg";
import { Link } from "react-router-dom";
import { Breadcrumb, Rate, Button } from "antd";
import Specialdealscard from "../cards/Specialdealscard";
import secureicon from "./images/SecurepaymentIcon.svg";
import { Card, Pagination } from "antd";
import Heading from "../Heading/Heading";
import { addCartItem, fetchCartItems } from "../../../store/cartSlice";
import sizefit from "../Specificproductpage/images/sizefit.svg";
import shipping from "../Specificproductpage/images/shipping.svg";
import returns from "../Specificproductpage/images/returns.svg";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import "./FabricSpecificPage.css";
import {
	addWishlistItem,
	fetchWishlistItems,
} from "../../../store/wishListSlice";

const { Meta } = Card;

const FabricSpecificPage = () => {
	const dispatch = useDispatch();

	const Navigate = useNavigate();
	const { id } = useParams();

	const [singleFabric, setSingleFabric] = useState([]);

	const { fabrics } = useSelector((state) => state.products);
	console.log("singlepro", singleFabric);
	console.log("fabrics", fabrics);

	const [imgno, setimgno] = useState(0);
	const [arrayimgs, setarrayimgs] = useState([]);
	const [productColorId, selectProductColorId] = useState(null);
	const [inputQuantity, setinputQuantity] = useState(0.5);
	const [selectedColorid, setselectedColorid] = useState(null);
	const [message, setMessage] = useState("");

	const { apiurl, access_token } = useSelector((state) => state.auth);

	useEffect(() => {
		fetchFabricdata({ id, apiurl });
	}, [id]);

	useEffect(() => {
		dispatch(fetchFabrics());
	}, [dispatch, id]);

	const fetchFabricdata = async ({ id, apiurl }) => {
		try {
			const response = await fetch(`${apiurl}/products/${id}`);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Network response was not ok");
			}
			const data = await response.json();

			setSingleFabric(data);
		} catch (error) {
			console.error("Error fetching fabric:", error.message);
			throw error;
		}
	};

	useEffect(() => {
		if (
			singleFabric.product_colors &&
			singleFabric.product_colors.length > 0 &&
			!selectedColorid
		) {
			const firstColorId = singleFabric.product_colors[0].color.id;
			handleColorSelect(firstColorId);
			selectProductColorId(singleFabric.product_colors[0].id);
		}
	}, [singleFabric?.product_colors, selectedColorid, id, dispatch]);
	const [colorQuentity, setcolorQuentity] = useState(null);

	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 4;
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const displayedProducts = fabrics?.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const handleUparrow = () => {
		if (imgno > 0) {
			setimgno(imgno - 1);
		}
		if (imgno < 0) {
			setimgno(arrayimgs.length - 1);
		}
	};

	const handleDownarrow = () => {
		if (imgno < 2) {
			setimgno(imgno + 1);
		}
	};

	const handleimges = (idx) => {
		setimgno(idx);
	};

	const handleColorSelect = (id) => {
		setselectedColorid(id);
		const selectedColorObj = singleFabric.product_colors.find(
			(obj) => obj.color.id === id
		);
		if (selectedColorObj) {
			const imagesurls = selectedColorObj.images.map((imageobj) => {
				return imageobj.image;
			});
			setarrayimgs(imagesurls);
			setcolorQuentity(selectedColorObj.stock_quantity);
			selectProductColorId(selectedColorObj.id);
		}
	};

	const increaseQuantity = () => {
		const newQuantity = inputQuantity + 0.5;
		if (newQuantity <= colorQuentity) {
			setinputQuantity(newQuantity);
			setMessage("");
		} else {
			setMessage("Quantity exceeds available stock.");
		}
	};

	const decreaseQuantity = () => {
		const newQuantity = inputQuantity - 0.5;
		if (newQuantity >= 0.5) {
			setinputQuantity(newQuantity);
			setMessage("");
		}
	};

	const handleQuentityInput = (e) => {
		const input = parseFloat(e.target.value);
		if (isNaN(input) || input < 0.5) {
			setinputQuantity(0.5);
			setMessage("Minimum quantity is 0.5.");
		} else if (input > colorQuentity) {
			setMessage("Quantity exceeds available stock.");
		} else {
			setinputQuantity(input);
			setMessage("");
		}
	};

	const handleWishList = async () => {
		const item = {
			item_id: productColorId,
		};
		try {
			const resultAction = await dispatch(
				addWishlistItem({ apiurl, access_token, item })
			);
			if (addCartItem.fulfilled.match(resultAction)) {
				dispatch(fetchWishlistItems({ apiurl, access_token }));
			}
		} catch (error) {
			console.error("Failed to add item to cart:", error);
		}
	};

	const handleAddtoCart = async () => {
		const item = {
			item_id: productColorId,
			quantity: inputQuantity,
		};

		try {
			const resultAction = await dispatch(
				addCartItem({ apiurl, access_token, item })
			);
			if (addCartItem.fulfilled.match(resultAction)) {
				Navigate("/cart ");

				dispatch(fetchCartItems({ apiurl, access_token }));
			}
		} catch (error) {
			console.error("Failed to add item to cart:", error);
		}
	};

	return (
		<div className="specific_product_page">
			<img
				src={productpageBanner}
				alt="products"
				className="productpageBanner"
			/>
			<div className="product_imgs_detail_container">
				<div className="right-main">
					<div className="imgs_navigator">
						<div className="only_img">
							{arrayimgs.map((img, index) => (
								<img
									key={index}
									src={`${apiurl}${img}`}
									className={`nav_imgs ${
										imgno === index ? "selected_img" : ""
									}`}
									alt={`Nav ${index}`}
									onClick={() => handleimges(index)}
								/>
							))}
						</div>

						<div className="arrows">
							<img alt="arrow" src={uparrow} onClick={handleUparrow} />
							<img
								alt="arrow"
								className="rotate-img"
								src={downarrow}
								onClick={handleDownarrow}
							/>
						</div>
					</div>
					<div className="spec-prod-img">
						<img
							src={`${apiurl}${arrayimgs[imgno]}`}
							alt="productimage"
							className="pro_image"
						/>
						<Button
              className="sp-prd-heartbtn"
							style={{ backgroundColor: "gray", color: "white" }}
							onClick={handleWishList}>
							<HeartOutlined />
						</Button>
					</div>
				</div>

				<div className="details_container">
					<Breadcrumb
						separator=">"
						items={[
							{
								title: <Link to="/">Home</Link>,
							},
							{
								title: <Link to="/fabrics">Fabrics</Link>,
							},
							{
								title: <>{singleFabric.name}</>,
							},
						]}
					/>
					<h2 className="heading">{singleFabric.name}</h2>

					<div className="product-info">
						{singleFabric?.product_colors &&
							singleFabric?.product_colors.length > 0 && (
								<h2 className="heading">
									₹{singleFabric?.product_colors[0]?.price} /meter
								</h2>
							)}
					</div>

					<div className="rating_and_comments">
						<div className="rating">
							<Rate
								allowHalf
								disabled
								allowClear={false}
								defaultValue={2.5}
								className="no-hover-rate"
							/>
						</div>
						<div className="comments">
							<img src={commentsicon} alt="comments" />
							<h3>{120} comments</h3>
						</div>
					</div>
					<div className="product_description">{singleFabric.description}</div>
					<h2 className="colors_heading">Colours Available</h2>

					<div
						className="colors_container"
						style={{ display: "flex", gap: "10px" }}>
						{singleFabric.product_colors &&
							singleFabric.product_colors.map((obj) => (
								<div
									key={obj.color.id}
									onClick={() => handleColorSelect(obj.color.id)}
									style={{
										width: "30px",
										height: "30px",
										backgroundColor: obj.color.name.toLowerCase(),
										cursor: "pointer",
										borderRadius: "50px",
										border:
											selectedColorid === obj.color.id
												? "2px solid #F24C88"
												: "",
									}}></div>
							))}
					</div>
					<div className="cart_quentity">
						<button className="cart_but" onClick={handleAddtoCart}>
							<i
								className="fas fa-shopping-cart"
								style={{ marginRight: "8px", color: "white" }}></i>
							Add to cart
						</button>

						<div
							className="quentity_but"
							style={{ display: "flex", alignItems: "center" }}>
							<Button
								className="dec_but"
								onClick={decreaseQuantity}
								disabled={inputQuantity <= 1}>
								-
							</Button>
							<input
								className="inputQuantity"
								type="text"
								value={inputQuantity}
								onChange={handleQuentityInput}
							/>

							<Button
								className="inc_but"
								onClick={increaseQuantity}
								disabled={inputQuantity >= singleFabric.stock_quantity}>
								+
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="product_description_video">
				<div className="product_description_container">
					<div className="product_description">
						<div className="product_d">
							<img src={secureicon} alt="secure" />
							<h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
								Secure payment
							</h2>
						</div>
						<div className="product_d" style={{ borderRight: "none" }}>
							<img src={sizefit} alt="sizefit" />
							<h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
								Perfect Size & Fit
							</h2>
						</div>
						<div
							className="product_d"
							style={{ borderLeft: "none", borderBottom: "none" }}>
							<img src={shipping} alt="shipping" />
							<h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
								Faster Delivery
							</h2>
						</div>
						<div
							className="product_d"
							style={{ borderRight: "none", borderBottom: "none" }}>
							<img src={returns} alt="returns" />
							<h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
								2 Day Return
							</h2>
						</div>
					</div>
				</div>
				<video
					className="video"
					loop
					autoPlay
					muted
					style={{ borderRadius: "10px" }}>
					<source src={sareevideo} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			</div>

			<div>
				<div className="related-products-container">
					<Heading>Related Products</Heading>
					<div className="related-products-list">
						{displayedProducts?.map((product) => {
							const firstColorImage =
								product.product_colors?.[0]?.images?.[0]?.image ||
								product.image;
							const firstPrice = product.product_colors?.[0]?.price;
							return (
								<div>
									<Card
										bordered={false}
										className="related-products-item"
										cover={
											<Link to={`/products/${product.id}`}>
												<img
													alt={product.name}
													src={`${apiurl}${firstColorImage}`}
													style={{
														cursor: "pointer",
														width: "100%",
														borderRadius: "10px",
														objectFit: "cover",
														height: "360px",
														objectPosition: "top",
													}}
												/>
											</Link>
										}>
										<div className="product-info">
											<Meta
												title={
													<Link
														to={`/products/${product.id}`}
														style={{
															color: "inherit",
															textDecoration: "none",
														}}>
														{product.name}
													</Link>
												}
												description="In stock"
											/>
											<Button
												type="primary"
												style={{
													width: "45%",
													backgroundColor: "#F6F6F6",
													color: "#3C4242",
												}}>
												Rs: {firstPrice}
											</Button>
										</div>
									</Card>
								</div>
							);
						})}
					</div>

					<Pagination
						current={currentPage}
						total={fabrics?.length}
						pageSize={pageSize}
						onChange={handlePageChange}
						className="custom-pagination"
						style={{ marginTop: "20px", marginBottom: "20px" }}
						itemRender={(page, type, originalElement) => {
							if (type === "prev") {
								return (
									<img
										src="/Paginationleftarrow.svg"
										alt="Previous"
										style={{ width: "20px" }}
									/>
								);
							}
							if (type === "next") {
								return (
									<img
										src="/Paginationrightarrow.svg"
										alt="Next"
										style={{ width: "20px" }}
									/>
								);
							}
							return originalElement;
						}}
					/>
				</div>
			</div>
			<Specialdealscard></Specialdealscard>
		</div>
	);
};

export default FabricSpecificPage;
