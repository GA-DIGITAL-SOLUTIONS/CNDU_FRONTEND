import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchDressProducts,
	fetchSarees,
	fetchBlouses,
} from "../../../store/productsSlice";
import productpageBanner from "./productpageBanner.png";
import uparrow from "./images/uparrow.svg";
import downarrow from "./images/uparrow.svg";
import { Link } from "react-router-dom";
import { Breadcrumb, Rate, Button } from "antd";
import secureicon from "./images/SecurepaymentIcon.svg";
import sizefit from "./images/sizefit.svg";
import shipping from "./images/shipping.svg";
import returns from "./images/returns.svg";
import { Card, Pagination } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { message } from "antd";
import Heading from "../Heading/Heading";
import {
	addCartItem,
	fetchCartItems,
	removeCartItem,
} from "../../../store/cartSlice";
import {
	addWishlistItem,
	fetchWishlistItems,
	removeWishlistItem,
} from "../../../store/wishListSlice";

import "./SpecificProductpage.css";
import FetchCostEstimates from "../cards/Estimations";
import Loader from "../../Loader/Loader";

const { Meta } = Card;

const SpecificProductpage = () => {
	const { pagetype, id } = useParams();
	const [CartIds, setCartIds] = useState([]);
	const dispatch = useDispatch();
	const [cartButton, setCartButton] = useState("addtocart");
	const [colorsizes, setColorSizes] = useState([]);
	const [sizesOfEachColor, setSizesofEachColor] = useState([]);
	const [colorObj, SetColorOBj] = useState(null);

	const cartStoreItems = useSelector((state) => state.cart.items);

	const { addCartItemloading } = useSelector((state) => state.cart);

	const { items } = useSelector((state) => state.wishlist);

	useEffect(() => {
		fetchSareeId({ id, apiurl });
		dispatch(fetchCartItems({ apiurl, access_token }));
		dispatch(fetchWishlistItems({ apiurl, access_token }));
	}, [dispatch, id, pagetype]);

	useEffect(() => {
		if (pagetype === "products") {
			dispatch(fetchSarees());
		} else if (pagetype === "dresses") {
			dispatch(fetchDressProducts());
		} else {
			dispatch(fetchBlouses());
		}
	}, [dispatch, id, pagetype]);

	useEffect(() => {
		const carids = cartStoreItems?.items?.map((obj) => {
			return obj.item.id;
		});
		setCartIds(carids);
	}, [id, dispatch]);

	const [singleSaree, setSingleSaree] = useState({});
	const Navigate = useNavigate();
	const [imgno, setimgno] = useState(0);
	const [arrayimgs, setarrayimgs] = useState([]);
	const [wishlistmatchedProductColorIds, setwishlistmatchedProductColorIds] =
		useState([]);
	const [colorStock, setColorStock] = useState(null);
	const [isColorPrebook, setIsColorPrebook] = useState(false);
	const [colorPrebookStock, setPrebookStock] = useState(false);
	const [singlesareeloading, setsinglesareeloading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [colorSize, setColorSize] = useState("");
	const [selectedSize, setSelectedSize] = useState(null);
	const { dresses, dressloading, dresserror, blousesloading } = useSelector(
		(store) => store.products
	);

	let isLoading;

	if (pagetype === "products") {
		isLoading = singlesareeloading;
	} else if (pagetype === "dresses") {
		isLoading = dressloading;
	} else if (pagetype === "blouses") {
		isLoading = blousesloading;
	} else {
		isLoading = false;
	}

	const sareesFromStore = useSelector((state) => state.products?.sarees || []);
	const dressesFromStore = useSelector(
		(state) => state.products?.dresses || []
	);
	const blousesFromStore = useSelector(
		(state) => state.products?.blouses || []
	);

	let sarees;
	if (pagetype === "products") {
		sarees = sareesFromStore;
	} else if (pagetype === "dresses") {
		sarees = dressesFromStore;
	} else if (pagetype === "blouses") {
		sarees = blousesFromStore;
	} else {
		isLoading = false;
	}

	const [selectedColorid, setselectedColorid] = useState(null);
	const [productColorId, selectProductColorId] = useState(null);
	const [productColorPrice, selectProductColorPrice] = useState(null);
	const [productColorPercentage, selectProductColorPercentage] = useState(null);
	const [productColorDiscount, selectproductColorDiscount] = useState(null);

	const fetchSareeId = async ({ id, apiurl }) => {
		setsinglesareeloading(true);
		try {
			const response = await fetch(`${apiurl}/products/${id}`);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Network response was not ok");
			}
			const data = await response.json();
			setSingleSaree(data);
			setsinglesareeloading(false);
		} catch (error) {
			console.error("Error fetching fabric:", error.message);
			throw error;
			setsinglesareeloading(false);
		}
	};

	useEffect(() => {
		let matchedProductColorIds = [];
		items?.forEach((obj) => {
			const matchingColor = singleSaree?.product_colors?.find(
				(p_c_obj) => p_c_obj.id === obj.item.id
			);
			if (matchingColor) {
				matchedProductColorIds.push(matchingColor.id);
			}
		});
		setwishlistmatchedProductColorIds(matchedProductColorIds);
	}, [items, dispatch]);

	useEffect(() => {
		console.log(
			"selectedSize price ",
			colorObj?.price,
			"discounted price ",
			colorObj?.discount_price
		);

		selectProductColorPrice(colorObj?.price);
		selectproductColorDiscount(colorObj?.discount_price);
		setColorStock(colorObj?.stock_quantity);
		setPrebookStock(colorObj?.pre_book_quantity);
		setIsColorPrebook(colorObj?.pre_book_eligible);
		setinputQuantity(1);

		setCartButton("handleRemoveFromcart");

		console.log("colorPrebookStock", colorPrebookStock);
	}, [selectedSize, colorObj]);

	useEffect(() => {
		if (singleSaree.product_colors && singleSaree?.product_colors?.length > 0) {
			const firstColorId = singleSaree.product_colors[0].color.id;
			handleColorSelect(firstColorId);

			selectProductColorId(singleSaree.product_colors[0].id);
			setSelectedSize(singleSaree.product_colors[0].size);

			selectProductColorPrice(singleSaree?.product_colors[0]?.price);
			selectproductColorDiscount(
				singleSaree?.product_colors[0]?.discount_price
			);
			selectProductColorPercentage(
				singleSaree?.product_colors[0]?.discount_percentage
			);
			setColorStock(singleSaree?.product_colors[0]?.stock_quantity);
			setIsColorPrebook(singleSaree?.product_colors[0]?.pre_book_eligible);
			setPrebookStock(singleSaree?.product_colors[0]?.pre_book_quantity);
			setColorSize(singleSaree?.product_colors[0]?.size);

			const colorSizes = singleSaree?.product_colors.reduce((acc, obj) => {
				const colorId = obj.color.id;

				if (colorId) {
					acc.push({
						colorId: colorId,
						sizecolorid: obj.id,
						size: obj.size,
					});
				}

				return acc;
			}, []);
			setColorSizes(colorSizes);
		}
	}, [singleSaree, id, dispatch, pagetype]);

	useEffect(() => {
		const eachcolorsizes = colorsizes.filter(
			(obj) => obj.colorId == selectedColorid
		);
		setSizesofEachColor(eachcolorsizes);
	}, [selectedColorid, colorsizes]);

	useEffect(() => {
		if (pagetype == "dresses") {
			const selectedSizeId = sizesOfEachColor.filter(
				(obj) => obj.colorId == selectedColorid
			);
			selectProductColorId(selectedSizeId[0]?.sizecolorid);
			setSelectedSize(selectedSizeId[0]?.size);
		}
	}, [sizesOfEachColor]);

	useEffect(() => {
		if (pagetype == "dresses") {
			const filterobj = singleSaree?.product_colors?.filter((obj) => {
				if (selectedSize == obj.size && productColorId == obj.id) {
					return obj;
				}
			});
			const allImages =
				filterobj
					?.map((obj) => obj.images.map((imgobj) => imgobj.image))
					.flat() || [];

			setarrayimgs(allImages);
		}
		const selectedCOLOROBj = singleSaree?.product_colors?.find(
			(obj) => obj.id === productColorId
		);

		SetColorOBj(selectedCOLOROBj);
	}, [productColorId]);

	const [inputQuantity, setinputQuantity] = useState(1);

	const [currentPage, setCurrentPage] = useState(1);
	const [Sarees, SetSarees] = useState(null);

	const pageSize = 4;

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	useEffect(() => {
		const pros = sarees?.filter((product) => {
			return product?.is_active && product?.id !== singleSaree?.id;
		});

		SetSarees(pros);
	}, [sarees, singleSaree]);

	const displayedProducts = Sarees?.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const { apiurl, access_token, userRole } = useSelector((state) => state.auth);

	const handleUparrow = () => {
		if (imgno > 0) {
			setimgno(imgno - 1);
		} else if (imgno <= 0) {
			setimgno(imgno + arrayimgs?.length - 1);
		}
	};

	const handleDownarrow = () => {
		if (imgno < arrayimgs?.length - 1) {
			setimgno(imgno + 1);
		} else if (imgno >= arrayimgs?.length - 1) {
			setimgno(0);
		}
	};

	const handleimges = (idx) => {
		setimgno(idx);
	};

	const handleColorSelect = (id) => {
		setselectedColorid(id);
		const selectedColorObj = singleSaree.product_colors.find(
			(obj) => obj.color.id === id
		);

		if (selectedColorObj) {
			selectProductColorPrice(selectedColorObj?.price);
			selectproductColorDiscount(selectedColorObj?.discount_price);
			selectProductColorPercentage(selectedColorObj?.discount_percentage);

			if (pagetype == "dresses") {
			} else {
				selectProductColorId(selectedColorObj?.id);
				const imagesurls = selectedColorObj.images.map(
					(imageobj) => imageobj.image
				);
				setarrayimgs(imagesurls);
			}

			setColorStock(selectedColorObj?.stock_quantity);
			setinputQuantity(1);
			setIsColorPrebook(selectedColorObj?.pre_book_eligible);
			setPrebookStock(selectedColorObj?.pre_book_quantity);
		}
	};

	const increaseQuantity = () => {
		const newQuantity = Number(inputQuantity) + 1;

		if (Number(colorStock) < newQuantity) {
			message.info(
				`You have reached the maximum quantity of ${Number(colorStock)}.`
			);
			return;
		}
		setinputQuantity(newQuantity);
	};

	const increaseprebookquantity = () => {
		const newQuantity = Number(inputQuantity) + 1;

		if (Number(colorPrebookStock) < newQuantity) {
			message.info(
				`You have reached the maximum pre-booking quantity of ${Number(
					colorPrebookStock
				)}.`
			);
			return;
		}
		setinputQuantity(newQuantity);
	};

	const decreaseQuantity = () => {
		const newQuantity = Number(inputQuantity) - 1;
		if (newQuantity >= 0.5) {
			setinputQuantity(newQuantity);
		}
	};

	const handleQuentityInput = (e) => {
		const newQuantity = e.target.value;

		if (Number(colorStock) < Number(newQuantity)) {
			message.info(
				`You have reached the maximum  quantity of ${Number(colorStock)}.`
			);
			return;
		}

		setinputQuantity(newQuantity);
	};

	const handleQuentityInputprebook = (e) => {
		const newQuantity = e.target.value;
		if (Number(colorPrebookStock) < Number(newQuantity)) {
			message.info(
				`You have reached the maximum pre-booking quantity of ${Number(
					colorPrebookStock
				)}.`
			);
			return;
		}

    setinputQuantity(newQuantity);
  };
  const handleAddtoCart = async () => {
    const item = {
      item_id: productColorId,
      quantity: inputQuantity,
    };
    if (!userRole) {
      message.error("Please login to add to cart");
      return;
    }
    try {
      const resultAction = await dispatch(
        addCartItem({ apiurl, access_token, item })
      );
      if (addCartItem.fulfilled.match(resultAction)) {
        Navigate("/cart ");
        dispatch(fetchCartItems({ apiurl, access_token }));
      }
    } catch (error) {
      console.error(" Adding item to cart is failed:", error);
      message.error("Adding item to cart is failed:");
    }
  };
  const handleWishList = async () => {
     if(!access_token){
          return message.warning("please login to add items in wishlist");
        }
    if (wishlistmatchedProductColorIds?.includes(productColorId)) {
      // console.log(
      //   `so, when this invoke then remove this productColorId ${productColorId} to wishlist `
      // );
      const removeeeee = items.find((obj) => obj.item.id === productColorId);
      const matchedId = removeeeee ? removeeeee.id : null;
      // console.log("remove id is ", matchedId);
      dispatch(removeWishlistItem({ apiurl, access_token, itemId: matchedId }))
        .unwrap()
        .then(() => {
          dispatch(fetchWishlistItems({ apiurl, access_token }));
        })
        .catch((error) => {
          console.error("Failed to remove item:", error);
        });
    } else {
      // console.log(
      //   `so, when this invoke then add  this productColorId ${productColorId} to wishlist `
      // );
      const item = {
        item_id: productColorId,
      };
      try {
        await dispatch(addWishlistItem({ apiurl, access_token, item }))
          .unwrap()
          .then(() => {
            message.success("Item successfully added to the wishlist!");
            dispatch(fetchWishlistItems({ apiurl, access_token }));
          });
        // Navigate("/profile");
      } catch (error) {
        message.error("Please Login to add item to wishlist");
        console.error("Failed to add item to wishlist:", error);
      }
    }
  };

	const ctd = CartIds?.find((id) => id === productColorId);

	useEffect(() => {
		const isAlreadyInCart = CartIds?.some((id) => id === productColorId);
		if (isAlreadyInCart) {
			setCartButton("handleRemoveFromcart");
		}
	}, [id, dispatch, cartButton]);

	const url = singleSaree.youtubeLink;
	const videoId = url?.split("/").pop().split("?")[0];

	const handleSizeClick = (size, sizecolorid) => {
		selectProductColorId(sizecolorid);
		setSelectedSize(size);
	};

	return (
		<div className="specific_product_page">
			{isLoading ? (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "60%",
						backgroundColor: "rgba(255, 255, 255, 0.8)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 9999,
					}}>
					<Loader />
				</div>
			) : (
				<>
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
								{wishlistmatchedProductColorIds.includes(productColorId) ? (
									<>
										<img
											src={`${apiurl}${arrayimgs[imgno]}`}
											alt="productimage"
											className="pro_image"
											style={{
												opacity: colorStock <= 0 ? 0.5 : 1,
											}}
										/>
										<Button
											className="sp-prd-heartbtn"
											style={{ backgroundColor: "gray" }}
											onClick={handleWishList}>
											<HeartFilled style={{ color: "red" }} />
										</Button>
									</>
								) : (
									<>
										<img
											src={`${apiurl}${arrayimgs[imgno]}`}
											alt="productimage"
											className="pro_image"
											style={{
												opacity: colorStock <= 0 ? 0.5 : 1,
											}}
										/>
										<Button
											className="sp-prd-heartbtn"
											style={{ backgroundColor: "gray" }}
											onClick={handleWishList}>
											<HeartOutlined style={{ color: "red" }} />
										</Button>
									</>
								)}
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
										title: (
											<Link to={`/${pagetype}`}>
												{pagetype.charAt(0).toUpperCase() + pagetype.slice(1)}
											</Link>
										),
									},
									{
										title: <>{singleSaree?.name || "Details"}</>,
									},
								]}
							/>

							<h2 className="heading">{singleSaree.name}</h2>
							{singleSaree?.product_colors &&
								singleSaree?.product_colors?.length > 0 && (
									<div
										style={{
											marginBottom: "10px",
											display: "flex",
											alignItems: "center",
										}}>
										<h4
											style={{
												textDecoration: "line-through",
												color: "red",
												marginRight: "8px",
												marginTop: "10px",
											}}>
											₹{Number(productColorPrice)}
										</h4>
										<h2
											className="heading"
											style={{ display: "inline", color: "green" }}>
											{" "}
											₹{Number(productColorDiscount)}
											<span style={{ marginLeft: "8px" }}> per meter</span>
										</h2>
									</div>
								)}
							{colorStock <= 0 ? (
								<div
									style={{
										marginBottom: "20px",
										fontWeight: "600",
										color: "red",
										fontSize: "x-large",
									}}>
									{singleSaree?.product_colors?.length > 1
										? "color out of stock"
										: "out of stock"}
								</div>
							) : (
								""
							)}
							<div className="rating_and_comments">
								<div className="rating">
									<Rate
										disabled
										allowClear={false}
										value={singleSaree?.avg_rating || 0}
										className="no-hover-rate"
									/>

									<h3>{singleSaree?.total_reviews || 0} Reviews</h3>
								</div>
							</div>

							<h2 className="colors_heading">Colours Available</h2>
							<div
								className="colors_container"
								style={{ display: "flex", gap: "10px" }}>
								{singleSaree?.product_colors &&
									Array.from(
										new Map(
											singleSaree?.product_colors.map((obj) => [
												obj.color.id,
												obj,
											])
										).values()
									).map((obj) => (
										<div
											key={obj.color.id}
											onClick={() => handleColorSelect(obj.color.id)}
											style={{
												width: "30px",
												height: "30px",
												backgroundColor: obj?.color?.hexcode,
												cursor: "pointer",
												borderRadius: "50px",
												border:
													selectedColorid === obj.color.id
														? "2px solid #F24C88"
														: "",
											}}>
											{}
										</div>
									))}
							</div>
							{pagetype == "dresses" &&
								colorObj?.size != null &&
								colorObj?.size != "" && (
									<div style={{ marginTop: "20px" }}>
										<strong>Size:{selectedSize}</strong>
										<h4>Available Sizes:</h4>
										<div style={{ display: "flex", gap: "10px" }}>
											{sizesOfEachColor?.map((obj, index) => (
												<div
													key={index}
													onClick={() =>
														handleSizeClick(obj?.size, obj?.sizecolorid)
													}
													style={{
														padding: "10px",
														border: "1px solid #ccc",
														borderRadius: "5px",
														cursor: "pointer",
														backgroundColor:
															selectedSize == obj?.size &&
															obj?.sizecolorid == productColorId
																? "black"
																: "#f9f9f9",
														color:
															selectedSize == obj?.size &&
															obj?.sizecolorid == productColorId
																? "white"
																: "black",
													}}>
													{obj?.size}
												</div>
											))}
										</div>
									</div>
								)}

							<div className="estimated-delivery-container">
								<h3>
									<strong>Estimated Delivery :</strong>
								</h3>
								<h3>Within 7-10 Days</h3>
							</div>
							{}
							<div className="cart_quentity">
								{colorStock <= 0 ? (
									isColorPrebook && colorPrebookStock > 0 ? (
										<>
											<Button
												className="cart_but"
												onClick={handleAddtoCart}
												loading={addCartItemloading}>
												<i
													className="fas fa-shopping-cart"
													style={{ marginRight: "8px", color: "white" }}></i>
												Pre-Booking
											</Button>

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
													type="number"
													step={1}
													value={inputQuantity}
													onChange={handleQuentityInputprebook}
												/>

												<Button
													className="inc_but"
													onClick={increaseprebookquantity}
													disabled={inputQuantity > colorPrebookStock}>
													+
												</Button>
											</div>
										</>
									) : (
										""
									)
								) : (
									<>
										<Button
											className="cart_but"
											onClick={handleAddtoCart}
											loading={addCartItemloading}>
											<i
												className="fas fa-shopping-cart"
												style={{ marginRight: "8px", color: "white" }}></i>
											Add to cart
										</Button>
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
												type="number"
												step={1}
												value={inputQuantity}
												onChange={handleQuentityInput}
											/>

											<Button
												className="inc_but"
												onClick={increaseQuantity}
												disabled={inputQuantity >= 1000}>
												+
											</Button>
										</div>
									</>
								)}
							</div>
							<div className="product_description">
								<h2>Description</h2>
								{pagetype === "dresses" && colorSize ? (
									<strong style={{ fontSize: "18px", color: "#333" }}>
										Size : {colorSize}
									</strong>
								) : null}
								<div
									className="desc-content"
									dangerouslySetInnerHTML={{
										__html: singleSaree.description,
									}}></div>
								<div></div>
							</div>
						</div>
					</div>

					<div className="product_description_video">
						<div className="product_description_container">
							<div className="product_meta_desc">
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
						<iframe
							className="video"
							src={`https://www.youtube.com/embed/${videoId}`}
							style={{
								borderRadius: "10px",
								width: "100%",
								maxWidth: "420px",
								height: "315px",
							}}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							title="YouTube video"></iframe>
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
										<div className="specificproductpage_related_products">
											<Card
												bordered={false}
												className="related-products-item"
												cover={
													<Link to={`/${product.type}s/${product.id}`}>
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
																to={`/${product.type}s/${product.id}`}
																style={{
																	color: "inherit",
																	textDecoration: "none",
																	display: "inline-block",
																	whiteSpace: "nowrap",
																	overflow: "hidden",
																	textOverflow: "ellipsis",
																	maxWidth: "260px",
																}}>
																{product.name?.length > 24
																	? `${product.name.substring(0, 24)}...`
																	: product.name}
															</Link>
														}
														description={
															<div className="prod-desc">
																<div>In stock</div>
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
														}
													/>
												</div>
											</Card>
										</div>
									);
								})}
							</div>

							<Pagination
								current={currentPage}
								total={Sarees?.length}
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
				</>
			)}
		</div>
	);
};

export default SpecificProductpage;
