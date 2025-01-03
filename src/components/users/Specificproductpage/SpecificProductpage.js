import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSareeById,
  fetchProducts,
  fetchDressProducts,
  fetchSarees,
} from "../../../store/productsSlice";
import productpageBanner from "./productpageBanner.png";
import uparrow from "./images/uparrow.svg";
import sareevideo from "./images/sareevideo.mp4";
import downarrow from "./images/uparrow.svg";
import commentsicon from "./images/comments.svg";
import { Link } from "react-router-dom";
import { Breadcrumb, Rate, Button, InputNumber, Spin } from "antd";
import Specialdealscard from "../cards/Specialdealscard";
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
  const { pagetype,id } = useParams();
  const [CartIds, setCartIds] = useState([]);
  const dispatch = useDispatch();
  const [cartButton, setCartButton] = useState("addtocart");

  const cartStoreItems = useSelector((state) => state.cart.items);
  console.log("cartStore", cartStoreItems);
  
  const { addCartItemloading, addCartItemerror } = useSelector(
    (state) => state.cart
  );
  const { items } = useSelector((state) => state.wishlist);

  console.log("wishlist items", items);

  useEffect(() => {
    fetchSareeId({ id, apiurl })
    dispatch(fetchCartItems({ apiurl, access_token }));
    dispatch(fetchWishlistItems({ apiurl, access_token }));
  }, [dispatch, id,pagetype]);

  useEffect(() => {
    if(pagetype==="products"){
      dispatch(fetchSarees());
    }else{
      dispatch(fetchDressProducts());
    }
  }, [dispatch,id,pagetype]); 

  useEffect(() => {
    const carids = cartStoreItems?.items?.map((obj) => {
      console.log(obj.item.id);
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

  const [singlesareeloading, setsinglesareeloading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { dresses, dressloading, dresserror } = useSelector(
    (store) => store.products
  );

  // Determine the loading state to use
  const isLoading = pagetype === "products" ? singlesareeloading : dressloading;

const sareesFromStore = useSelector((state) => state.products?.sarees || []);
const dressesFromStore = useSelector((state) => state.products?.dresses || []);

console.log("Dresses from Store:", dressesFromStore);
console.log("Sarees from Store:", sareesFromStore);

const sarees = pagetype === "products" ? sareesFromStore : dressesFromStore;

console.log("Final Sarees Data:", sarees);

  const [selectedColorid, setselectedColorid] = useState(null);
  const [productColorId, selectProductColorId] = useState(null);
  const [productColorPrice, selectProductColorPrice] = useState(null);

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
    if (
      singleSaree.product_colors &&
      singleSaree?.product_colors?.length > 0 
    ) {
      const firstColorId = singleSaree.product_colors[0].color.id;
      handleColorSelect(firstColorId);

      selectProductColorId(singleSaree.product_colors[0].id);
      selectProductColorPrice(singleSaree.product_colors[0].price);
    }
  }, [singleSaree,id, dispatch,pagetype]);

  

  const [inputQuantity, setinputQuantity] = useState(1);
  const [colorQuentity, setcolorQuentity] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  
  const displayedProducts = sarees?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  console.log("displayedProducts", displayedProducts, "sarees", sarees);

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
    console.log("idx", idx);
  };

  const handleColorSelect = (id) => {
    console.log("Selected color ID:", id);
    setselectedColorid(id);

    const selectedColorObj = singleSaree.product_colors.find(
      (obj) => obj.color.id === id
    );
    if (selectedColorObj) {
      console.log("For this color:", selectedColorObj.color.name);
      selectProductColorPrice(selectedColorObj.price);
      console.log("Images for this color:", selectedColorObj.images);
      const imagesurls = selectedColorObj.images.map((imageobj) => {
        return imageobj.image;
      });
      setarrayimgs(imagesurls);
      setcolorQuentity(selectedColorObj.stock_quantity);
      console.log("quentity", selectedColorObj.stock_quantity);
      selectProductColorId(selectedColorObj.id);
    }
  };

  const increaseQuantity = () => {
    const newQuantity = Number(inputQuantity) + 1;
    setinputQuantity(newQuantity);
  };

  const decreaseQuantity = () => {
    const newQuantity = Number(inputQuantity) - 1;
    if (newQuantity >= 0.5) {
      setinputQuantity(newQuantity);
    }
  };

  const handleQuentityInput = (e) => {
    setinputQuantity(e.target.value);
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
    if (wishlistmatchedProductColorIds?.includes(productColorId)) {
      console.log(
        `so, when this invoke then remove this productColorId ${productColorId} to wishlist `
      );
      const removeeeee = items.find((obj) => obj.item.id === productColorId);
      const matchedId = removeeeee ? removeeeee.id : null;
      console.log("remove id is ", matchedId);
      dispatch(removeWishlistItem({ apiurl, access_token, itemId: matchedId }))
        .unwrap()
        .then(() => {
          dispatch(fetchWishlistItems({ apiurl, access_token }));
        })
        .catch((error) => {
          console.error("Failed to remove item:", error);
        });
    } else {
      console.log(
        `so, when this invoke then add  this productColorId ${productColorId} to wishlist `
      );
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

  console.log("CartIds", CartIds);
  const ctd = CartIds?.find((id) => id === productColorId);
  console.log("ctd", ctd);

  useEffect(() => {
    const isAlreadyInCart = CartIds?.some((id) => id === productColorId);
    console.log("isAlreadyInCart", isAlreadyInCart);
    if (isAlreadyInCart) {
      setCartButton("handleRemoveFromcart");
    }
  }, [id, dispatch, cartButton]);

  const handleRemoveFromCart = () => {
    const itemid = CartIds.find((id) => id === productColorId);

    const cartitemid = cartStoreItems.items.find(
      (item) => item.item.id === itemid
    )?.id;
    console.log("cartitemid", cartitemid);

    const itemId = { cart_item_id: cartitemid };
    dispatch(removeCartItem({ apiurl, access_token, itemId }))
      .unwrap()
      .then(() => {
        setCartButton("addtocart");
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
    console.log("Item not found in the cart");
  };


  const url = singleSaree.youtubeLink;
  const videoId = url?.split('/').pop().split('?')[0];
  
  console.log(videoId);

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
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999, // Ensures the loader is on top of other content
          }}
        >
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
                    />
                    <Button
                      className="sp-prd-heartbtn"
                      style={{ backgroundColor: "gray" }}
                      onClick={handleWishList}
                    >
                      <HeartFilled style={{ color: "red" }} />
                    </Button>
                  </>
                ) : (
                  <>
                    <img
                      src={`${apiurl}${arrayimgs[imgno]}`}
                      alt="productimage"
                      className="pro_image"
                    />
                    <Button
                      className="sp-prd-heartbtn"
                      style={{ backgroundColor: "gray" }}
                      onClick={handleWishList}
                    >
                      <HeartOutlined style={{ color: "white" }} />
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
                  <h2 className="heading">
                    ₹{productColorPrice} <span>per unit</span>
                  </h2>
                )}
              <div className="rating_and_comments">
                <div className="rating">
                  <Rate
                    allowHalf
                    disabled
                    allowClear={false}
                    defaultValue={singleSaree.avg_rating}
                    className="no-hover-rate"
                  />
                  <h3>{singleSaree.comments || 0} Reviews</h3>
                </div>
              </div>

              <h2 className="colors_heading">Colours Available</h2>
              <div
                className="colors_container"
                style={{ display: "flex", gap: "10px" }}
              >
                {singleSaree.product_colors &&
                  singleSaree.product_colors.map((obj) => (
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
                      }}
                    >
                      {}
                    </div>
                  ))}
              </div>
              <div className="estimated-delivery-container">
                <h3>
                  <strong>Estimated Delivery :</strong>
                </h3>
                <h3>Within 7-10 Days</h3>
              </div>
              <div className="cart_quentity">
                {cartButton === "addtocart" ? (
                  <Button
                    className="cart_but"
                    onClick={handleAddtoCart}
                    loading={addCartItemloading}
                  >
                    <i
                      className="fas fa-shopping-cart"
                      style={{ marginRight: "8px", color: "white" }}
                    ></i>
                    Add to cart
                  </Button>
                ) : (
                  ""
                )}

                <div
                  className="quentity_but"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Button
                    className="dec_but"
                    onClick={decreaseQuantity}
                    disabled={inputQuantity <= 1}
                  >
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
                    disabled={inputQuantity >= 1000}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="product_description">
            <h2>Description</h2>
            <div
              className="desc-content"
              dangerouslySetInnerHTML={{ __html: singleSaree.description }}
            ></div>
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
                  style={{ borderLeft: "none", borderBottom: "none" }}
                >
                  <img src={shipping} alt="shipping" />
                  <h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
                    Faster Delivery
                  </h2>
                </div>
                <div
                  className="product_d"
                  style={{ borderRight: "none", borderBottom: "none" }}
                >
                  <img src={returns} alt="returns" />
                  <h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
                    2 Day Return
                  </h2>
                </div>
              </div>
            </div>
            <iframe
              className="video"
              src={
                `https://www.youtube.com/embed/${videoId}`
              }
              style={{
                borderRadius: "10px",
                width: "100%",
                maxWidth: "420px",
                height: "315px",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video"
            ></iframe>
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
                        }
                      >
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
                                }}
                              >
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
                                  }}
                                >
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
                total={sarees?.length}
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

  // return (

  // 	<div className="specific_product_page">
  // 		<img
  // 			src={productpageBanner}
  // 			alt="products"
  // 			className="productpageBanner"
  // 		/>
  // 		<div className="product_imgs_detail_container">
  // 			<div className="right-main">
  // 				<div className="imgs_navigator">
  // 					<div className="only_img">
  // 						{arrayimgs.map((img, index) => (
  // 							<img
  // 								key={index}
  // 								src={`${apiurl}${img}`}
  // 								className={`nav_imgs ${
  // 									imgno === index ? "selected_img" : ""
  // 								}`}
  // 								alt={`Nav ${index}`}
  // 								onClick={() => handleimges(index)}
  // 							/>
  // 						))}
  // 					</div>

  // 					<div className="arrows">
  // 						<img alt="arrow" src={uparrow} onClick={handleUparrow} />
  // 						<img
  // 							alt="arrow"
  // 							className="rotate-img"
  // 							src={downarrow}
  // 							onClick={handleDownarrow}
  // 						/>
  // 					</div>
  // 				</div>
  // 				<div className="spec-prod-img">
  // 					<img
  // 						src={`${apiurl}${arrayimgs[imgno]}`}
  // 						alt="productimage"
  // 						className="pro_image"
  // 					/>
  // 					<Button
  // 						className="sp-prd-heartbtn"
  // 						style={{ backgroundColor: "gray", color: "white" }}
  // 						onClick={handleWishList}>
  // 						<HeartOutlined />
  // 					</Button>
  // 				</div>
  // 			</div>

  // 			<div className="details_container">
  // 				<Breadcrumb
  // 					separator=">"
  // 					items={[
  // 						{
  // 							title: <Link to="/">Home</Link>,
  // 						},
  // 						{
  // 							title: <Link to="/products">Products</Link>,
  // 						},
  // 						{
  // 							title: <>{singleSaree.name}</>,
  // 						},
  // 					]}
  // 				/>
  // 				<h2 className="heading">{singleSaree.name}</h2>
  // 				{singleSaree?.product_colors &&
  // 					singleSaree?.product_colors.length > 0 && (
  // 						<h2 className="heading">
  // 							₹{productColorPrice} <span>per unit</span>
  // 						</h2>
  // 					)}
  // 				<div className="rating_and_comments">
  // 					<div className="rating">
  // 						<Rate
  // 							allowHalf
  // 							disabled
  // 							allowClear={false}
  // 							defaultValue={2.5}
  // 							className="no-hover-rate"
  // 						/>
  // 						<h3>{singleSaree.comments || 0} Reviews</h3>
  // 					</div>
  // 				</div>

  // 				<h2 className="colors_heading">Colours Available</h2>
  // 				<div
  // 					className="colors_container"
  // 					style={{ display: "flex", gap: "10px" }}>
  // 					{singleSaree.product_colors &&
  // 						singleSaree.product_colors.map((obj) => (
  // 							<div
  // 								key={obj.color.id}
  // 								onClick={() => handleColorSelect(obj.color.id)}
  // 								style={{
  // 									width: "30px",
  // 									height: "30px",
  // 									backgroundColor: obj.color.name.toLowerCase(),
  // 									cursor: "pointer",
  // 									borderRadius: "50px",
  // 									border:
  // 										selectedColorid === obj.color.id
  // 											? "2px solid #F24C88"
  // 											: "",
  // 								}}>
  // 								{}
  // 							</div>
  // 						))}
  // 				</div>
  // 				<FetchCostEstimates productId={id} />
  // 				<div className="cart_quentity">
  // 					{cartButton === "addtocart" ? (
  // 						<button
  // 							className="cart_but"
  // 							style={{ cursor: "pointer" }}
  // 							onClick={handleAddtoCart}>
  // 							<i
  // 								className="fas fa-shopping-cart"
  // 								style={{ marginRight: "8px", color: "white" }}></i>
  // 							Add to Cart
  // 						</button>
  // 					) : (
  // 						""
  // 					)}

  // 					<div style={{ display: "flex", alignItems: "center" }}>
  // 						<Button
  // 							className="dec_but"
  // 							onClick={decreaseQuantity}
  // 							disabled={inputQuantity <= 1}
  // 							style={{ width: "50px" }}>
  // 							-
  // 						</Button>
  // 						<InputNumber
  // 							className="inputQuantity"
  // 							min={1}
  // 							max={10000}
  // 							value={inputQuantity}
  // 							onChange={handleQuentityInput}
  // 							style={{ margin: "0 10px" }}
  // 							controls={false}
  // 						/>
  // 						<Button
  // 							className="inc_but"
  // 							onClick={increaseQuantity}
  // 							// disabled={inputQuantity >= colorQuentity}
  // 						>
  // 							+
  // 						</Button>
  // 					</div>
  // 				</div>
  // 			</div>
  // 		</div>
  // 		<div className="product_description">
  // 			<h2>Description</h2>
  // 			<div
  // 				className="desc-content"
  // 				dangerouslySetInnerHTML={{ __html: singleSaree.description }}></div>
  // 		</div>

  // 		<div className="product_description_video">
  // 			<div className="product_description_container">
  // 				<div className="product_meta_desc">
  // 					<div className="product_d">
  // 						<img src={secureicon} alt="secure" />
  // 						<h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
  // 							Secure payment
  // 						</h2>
  // 					</div>
  // 					<div className="product_d" style={{ borderRight: "none" }}>
  // 						<img src={sizefit} alt="sizefit" />
  // 						<h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
  // 							Perfect Size & Fit
  // 						</h2>
  // 					</div>
  // 					<div
  // 						className="product_d"
  // 						style={{ borderLeft: "none", borderBottom: "none" }}>
  // 						<img src={shipping} alt="shipping" />
  // 						<h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
  // 							Faster Delivery
  // 						</h2>
  // 					</div>
  // 					<div
  // 						className="product_d"
  // 						style={{ borderRight: "none", borderBottom: "none" }}>
  // 						<img src={returns} alt="returns" />
  // 						<h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
  // 							2 Day Return
  // 						</h2>
  // 					</div>
  // 				</div>
  // 			</div>
  // 			<iframe
  // 				className="video"
  // 				src="https://www.youtube.com/embed/kB3VPx7cXCM"
  // 				style={{
  // 					borderRadius: "10px",
  // 					width: "100%",
  // 					maxWidth: "420px",
  // 					height: "315px",
  // 				}}
  // 				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  // 				allowFullScreen
  // 				title="YouTube video"></iframe>
  // 		</div>
  // 		{}
  // 		<div>
  // 			<div className="related-products-container">
  // 				<Heading>Related Products</Heading>
  // 				<div className="related-products-list">
  // 					{displayedProducts?.map((product) => {
  // 						const firstColorImage =
  // 							product.product_colors?.[0]?.images?.[0]?.image ||
  // 							product.image;
  // 						const firstPrice = product.product_colors?.[0]?.price;
  // 						return (
  // 							<div className="specificproductpage_related_products">
  // 								<Card
  // 									bordered={false}
  // 									className="related-products-item"
  // 									cover={
  // 										<Link to={`/${product.type}s/${product.id}`}>
  // 											<img
  // 												alt={product.name}
  // 												src={`${apiurl}${firstColorImage}`}
  // 												style={{
  // 													cursor: "pointer",
  // 													width: "100%",
  // 													borderRadius: "10px",
  // 													objectFit: "cover",
  // 													height: "360px",
  // 													objectPosition: "top",
  // 												}}
  // 											/>
  // 										</Link>
  // 									}>
  // 									<div className="product-info">
  // 										<Meta
  // 											title={
  // 												<Link
  // 													to={`/${product.type}s/${product.id}`}
  // 													style={{
  // 														color: "inherit",
  // 														textDecoration: "none",
  // 														display: "inline-block",
  // 														whiteSpace: "nowrap",
  // 														overflow: "hidden",
  // 														textOverflow: "ellipsis",
  // 														maxWidth: "260px",
  // 													}}>
  // 													{product.name > 24
  // 														? `${product.name.substring(0, 24)}...`
  // 														: product.name}
  // 												</Link>
  // 											}
  // 											description={
  // 												<div className="prod-desc">
  // 													<div>In stock</div>
  // 													<Button
  // 														type="primary"
  // 														style={{
  // 															width: "45%",
  // 															backgroundColor: "#F6F6F6",
  // 															color: "#3C4242",
  // 														}}>
  // 														Rs: {firstPrice}
  // 													</Button>
  // 												</div>
  // 											}
  // 										/>
  // 									</div>
  // 								</Card>
  // 							</div>
  // 						);
  // 					})}
  // 				</div>

  // 				<Pagination
  // 					current={currentPage}
  // 					total={sarees?.length}
  // 					pageSize={pageSize}
  // 					onChange={handlePageChange}
  // 					className="custom-pagination"
  // 					style={{ marginTop: "20px", marginBottom: "20px" }}
  // 					itemRender={(page, type, originalElement) => {
  // 						if (type === "prev") {
  // 							return (
  // 								<img
  // 									src="/Paginationleftarrow.svg"
  // 									alt="Previous"
  // 									style={{ width: "20px" }}
  // 								/>
  // 							);
  // 						}
  // 						if (type === "next") {
  // 							return (
  // 								<img
  // 									src="/Paginationrightarrow.svg"
  // 									alt="Next"
  // 									style={{ width: "20px" }}
  // 								/>
  // 							);
  // 						}
  // 						return originalElement;
  // 					}}
  // 				/>
  // 			</div>
  // 		</div>
  // 		<Specialdealscard></Specialdealscard>
  // 	</div>
  // );
};

export default SpecificProductpage;
