import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSareeById, fetchProducts } from "../../../store/productsSlice";
import productpageBanner from "./productpageBanner.png";
import uparrow from "./images/uparrow.svg";
import sareevideo from "./images/sareevideo.mp4";
import downarrow from "./images/uparrow.svg";
import commentsicon from "./images/comments.svg";
import { Link } from "react-router-dom";
import { Breadcrumb, Rate, Button, InputNumber } from "antd";
import Specialdealscard from "../cards/Specialdealscard";
import secureicon from "./images/SecurepaymentIcon.svg";
import sizefit from "./images/sizefit.svg";
import shipping from "./images/shipping.svg";
import returns from "./images/returns.svg";
import { Slider, Card, Row, Col, Pagination } from "antd";
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
} from "../../../store/wishListSlice";

import "./SpecificProductpage.css";

const { Meta } = Card;

const SpecificProductpage = () => {
  const { id } = useParams();
  const [CartIds, setCartIds] = useState([]);
  const dispatch = useDispatch();
  const [cartButton, setCartButton] = useState("addtocart");

  const cartStoreItems = useSelector((state) => state.cart.items);
  console.log("cartStore", cartStoreItems);

  useEffect(() => {
    fetchSareeId({ id, apiurl });
    dispatch(fetchCartItems({ apiurl, access_token }));
  }, [id]);

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
  const { singleproductloading, singleproducterror } = useSelector(
    (state) => state.products
  );

  console.log("singlepro", singleSaree);

  const { products } = useSelector((state) => state.products);
  const [selectedColorid, setselectedColorid] = useState(null);
  const [productColorId, selectProductColorId] = useState(null);
  const [productColorPrice, selectProductColorPrice] = useState(null);

  const fetchSareeId = async ({ id, apiurl }) => {
    console.log("Fetching fabric by ID:", id);
    try {
      const response = await fetch(`${apiurl}/products/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched fabric data:", data);
      // return data;
      setSingleSaree(data);
    } catch (error) {
      console.error("Error fetching fabric:", error.message);
      throw error; // Re-throw the error for handling elsewhere
    }
  };

  useEffect(() => {
    if (
      singleSaree.product_colors &&
      singleSaree.product_colors.length > 0 &&
      !selectedColorid
    ) {
      const firstColorId = singleSaree.product_colors[0].color.id;
      handleColorSelect(firstColorId);

      selectProductColorId(singleSaree.product_colors[0].id);
      selectProductColorPrice(singleSaree.product_colors[0].price);
    }
  }, [singleSaree.product_colors, selectedColorid]);
  const [inputQuantity, setinputQuantity] = useState(1);
  const [colorQuentity, setcolorQuentity] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const Sarees = products.filter((prodcut) => {
    return prodcut.category.name === "Sarees";
  });

  const displayedProducts = Sarees?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const { apiurl, access_token, user } = useSelector((state) => state.auth);

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

  const handleQuantityChange = (method) => {
    console.log(method);
  };

  const increaseQuantity = () => {
    // if (inputQuantity < colorQuentity) {
    setinputQuantity(inputQuantity + 1);
    handleQuantityChange("inc");
    // }
  };

  const decreaseQuantity = () => {
    if (inputQuantity > 1) {
      setinputQuantity(inputQuantity - 1);
      handleQuantityChange("dec");
    }
  };

  // const handleQuentityInput = (e) => {
  //   const input = e.target.value;
  //   console.log("input", input);
  //   const singlepro_quantity = colorQuentity;
  //   setinputQuantity(input);
  //   if (input > singlepro_quantity) {
  //     console.log("quantity must be equal to ", colorQuentity);
  //     setinputQuantity(singlepro_quantity);
  //   } else if (input == 0) {
  //     console.log("quantity must be 1 or greater than one");
  //     setinputQuantity(1);
  //   }
  // };

  const handleQuentityInput = (value) => {
    console.log("input", value);
    const singlepro_quantity = colorQuentity;

    if (value > singlepro_quantity) {
      console.log("Quantity must not exceed", colorQuentity);
      setinputQuantity(singlepro_quantity);
    } else if (value <= 0) {
      console.log("Quantity must be at least 1");
      setinputQuantity(1);
    } else {
      setinputQuantity(value);
    }
  };

  const handleAddtoCart = async () => {
    console.log("user is not there see ");

    console.log("colorQuentity", colorQuentity);
    const str = `Quantity must not exceed", ${colorQuentity},"if you need pre book then `;
    if (user) {
      if (inputQuantity > colorQuentity) {
        message.info(str);
      } else {
        // add tocart if less than actual color quantity
        const item = {
          item_id: productColorId,
          quantity: inputQuantity,
        };
        try {
          const resultAction = await dispatch(
            addCartItem({ apiurl, access_token, item })
          );
          if (addCartItem.fulfilled.match(resultAction)) {
            console.log("Item added to cart:", resultAction.payload);
            Navigate("/cart");
            dispatch(fetchCartItems({ apiurl, access_token }));
            message.success("Item successfully added to the cart!");
          }
        } catch (error) {
          console.error("Failed to add item to cart:", error);
        }
      }
    } else {
      message.error("Please login to Add item to cart");
    }
  };

  const handleWishList = async () => {
    console.log("add this item to wish ", singleSaree.id);
    console.log("add this item to wish stock", singleSaree.stock_quantity);
    console.log("check type ", "product");

    const item = {
      item_id: productColorId,
    };
    dispatch(
      addWishlistItem({ apiurl, access_token, item })
        .unwrap()
        .then(() => {
          message.success("Item successfully added to the wishlist!");
          Navigate("/profile");
        })
    );
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
    // Find the first matching id (if any)
    const itemid = CartIds.find((id) => id === productColorId);

    const cartitemid = cartStoreItems.items.find(
      (item) => item.item.id === itemid
    )?.id;
    console.log("cartitemid", cartitemid);

    const itemId = { cart_item_id: cartitemid }; // Prepare the itemId object
    dispatch(removeCartItem({ apiurl, access_token, itemId }))
      .unwrap()
      .then(() => {
        setCartButton("addtocart"); // Update the button state to "add to cart"
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
    console.log("Item not found in the cart");
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
          <img
            src={`${apiurl}${arrayimgs[imgno]}`}
            alt="productimage"
            className="pro_image"
          />
        </div>

        <div className="details_container">
          <Breadcrumb
            separator=">"
            items={[
              {
                title: <Link to="/">Home</Link>,
              },
              {
                title: <Link to="/products">Products</Link>,
              },
              {
                title: <>{singleSaree.name}</>,
              },
            ]}
          />
          <h2 className="heading">{singleSaree.name}</h2>
          {singleSaree?.product_colors &&
            singleSaree?.product_colors.length > 0 && (
              <h2 className="heading">₹{productColorPrice}</h2>
            )}
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
            <Button
              style={{ backgroundColor: "gray", color: "white" }}
              onClick={handleWishList}
            >
              Add To wishlist
            </Button>
          </div>
          <div className="product_description">{singleSaree.description}</div>
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
                    backgroundColor: obj.color.name.toLowerCase(),
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
          <div className="cart_quentity">
            {
              cartButton === "addtocart" ? (
                <button
                  className="cart_but"
                  style={{ cursor: "pointer" }}
                  onClick={handleAddtoCart}
                >
                  <i
                    className="fas fa-shopping-cart"
                    style={{ marginRight: "8px", color: "white" }}
                  ></i>
                  Add to Cart
                </button>
              ) : (
                ""
              )
              // (
              //   <button className="cart_but" onClick={handleRemoveFromCart}>
              //     <i
              //       className="fas fa-trash-alt" // Change the icon to a trash icon for remove
              //       style={{ marginRight: "8px", color: "white" }}
              //     ></i>
              //     Remove from Cart
              //   </button>
              // )
            }

            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                className="dec_but"
                onClick={decreaseQuantity}
                disabled={inputQuantity <= 1}
                style={{ width: "50px" }}
              >
                -
              </Button>
              <InputNumber
                className="inputQuantity"
                min={1}
                max={10000}
                value={inputQuantity}
                onChange={handleQuentityInput}
                style={{ margin: "0 10px" }}
              />
              <Button
                className="inc_but"
                onClick={increaseQuantity}
                // disabled={inputQuantity >= colorQuentity}
              >
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
        <video
          className="video"
          loop
          autoPlay
          muted
          style={{ borderRadius: "10px" }}
        >
          <source src={sareevideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {}
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
                    }
                  >
                    <div className="product-info">
                      <Meta
                        title={
                          <Link
                            to={`/products/${product.id}`}
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                            }}
                          >
                            {product.name}
                            {product?.product_colors &&
                              product?.product_colors.length > 0 && (
                                <h2 className="heading">
                                  {product?.product_colors[0]?.price}
                                </h2>
                              )}
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
                        }}
                      >
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
      <Specialdealscard></Specialdealscard>
    </div>
  );
};

export default SpecificProductpage;
