import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFabrics, fetchProductById, fetchProducts } from "../../../store/productsSlice";
import productpageBanner from "./images/productpageBanner.png";
import sareevideo from "./images/sareevideo.mp4";
import uparrow from "./images/uparrow.svg";
import downarrow from "./images/uparrow.svg";
import commentsicon from "./images/comments.svg";
import { Link } from "react-router-dom";
import { Breadcrumb, Rate, Button } from "antd";
import Specialdealscard from "../cards/Specialdealscard";
import secureicon from "./images/SecurepaymentIcon.svg";
import { Slider, Card, Row, Col, Pagination } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import Heading from "../Heading/Heading";
import { addCartItem, fetchCartItems } from "../../../store/cartSlice";
import sizefit from "../Specificproductpage/images/sizefit.svg";
import shipping from "../Specificproductpage/images/shipping.svg";
import returns from "../Specificproductpage/images/returns.svg";
// import { addCartItem } from "../../../store/cartSlice";

import "./FabricSpecificPage.css";

const { Meta } = Card;

const FabricSpecificPage = () => {
  const cartStoreItems = useSelector((state) => state.cart.items);
  console.log("cartStore", cartStoreItems);

  const Navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [imgno, setimgno] = useState(0);
  const [arrayimgs, setarrayimgs] = useState([]);

  const { singleproduct, singleproductloading, singleproducterror } =
    useSelector((state) => state.products);
  console.log("singlepro", singleproduct);
  const { fabrics  } = useSelector((state) => state.products);

  const [productColorId, selectProductColorId] = useState(null);
  const [inputQuantity, setinputQuantity] = useState(0.5); // Initialize with current item quantity
  const [selectedColorid, setselectedColorid] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (
      singleproduct.product_colors &&
      singleproduct.product_colors.length > 0 &&
      !selectedColorid
    ) {
      // Set the first color id as the default selected color if no color is selected
      const firstColorId = singleproduct.product_colors[0].color.id;
      handleColorSelect(firstColorId);
      selectProductColorId(singleproduct.product_colors[0].id); // seting id to send the cart bro
      console.log("Setting default color ID:", firstColorId);

      // Optionally, you can log the color name and images of the first color
    }
  }, [singleproduct.product_colors, selectedColorid,id]);// i have added params to reload if it changes 
  const [colorQuentity, setcolorQuentity] = useState(null);
  console.log("q is ", singleproduct.stock_quantity);

  // Pagination statem
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Number of products per page
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // const Fabrics=fabrics.filter((product)=>{
  //   return  product.category.name==="Fabrics"
  // })

  // Slice products based on current page
  const displayedProducts = fabrics?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const url = apiurl;
  useEffect(() => {
    dispatch(fetchProductById({ id, url }));
    dispatch(fetchFabrics())
  }, []);

  console.log("img", singleproduct.image);

  if (singleproductloading) {
    return <div>Loading....</div>;
  } else if (singleproducterror) {
    return <div>Error: {singleproducterror}</div>;
  }

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
    setselectedColorid(id); // Set the selected color ID in state

    // Find the matching product color object
    const selectedColorObj = singleproduct.product_colors.find(
      (obj) => obj.color.id === id
    );

    console.log("selectProductColorId", selectedColorObj.id);
    // If the selected color exists, log the images and name
    if (selectedColorObj) {
      console.log("For this color:", selectedColorObj.color.name);
      console.log("Images for this color:", selectedColorObj.images);
      const imagesurls = selectedColorObj.images.map((imageobj) => {
        return imageobj.image;
      });
      setarrayimgs(imagesurls);
      setcolorQuentity(selectedColorObj.stock_quantity);
      selectProductColorId(selectedColorObj.id);
      console.log("quentity", selectedColorObj.stock_quantity);
    }
    // console.log("arrayimgs",arrayimgs)
  };

  const handleQuantityChange = (method) => {
    console.log(method);
  };

  /* 
  const handleQuantityChange = (method) => {
    console.log("handleQuantityChangeis working ");
    if (method === "inc") {
      const updateObj = {
        cart_item_id: cartitem.id,
        quantity: 1,
      };
      dispatch(updateQuantity({ apiurl, access_token, updateObj }));
      // dispatch(fetchCartItems({ apiurl, access_token }));

      console.log("updated items", items);
    } else if (method === "dec") {
      const updateObj = {
        cart_item_id: cartitem.id,
        quantity: -1,
      };
      dispatch(updateQuantity({ apiurl, access_token, updateObj }));
    }
  };
  */

  // Increase quantity function

  const increaseQuantity = () => {
    const newQuantity = inputQuantity + 0.5;
    if (newQuantity <= colorQuentity) {
      setinputQuantity(newQuantity);
      setMessage(""); // Clear the error message if valid
    } else {
      setMessage("Quantity exceeds available stock.");
    }
  };

  const decreaseQuantity = () => {
    const newQuantity = inputQuantity - 0.5;
    if (newQuantity >= 0.5) {
      setinputQuantity(newQuantity);
      setMessage(""); // Clear the error message if valid
    }
  };
  const handleQuentityInput = (e) => {
    const input = parseFloat(e.target.value);
    if (isNaN(input) || input < 0.5) {
      setinputQuantity(0.5);
      setMessage("Minimum quantity is 0.5.");
    } else if (input > colorQuentity) {
      // setinputQuantity(colorQuentity);
      setMessage("Quantity exceeds available stock.");
    } else {
      setinputQuantity(input);
      setMessage(""); // Clear the error message if valid
    }
  };

  const handleAddtoCart = async () => {
    console.log(productColorId);
    const item = {
      item_id: productColorId, // here i need to add the product color id
      quantity: inputQuantity,
    };

    try {
      const resultAction = await dispatch(
        addCartItem({ apiurl, access_token, item })
      );
      if (addCartItem.fulfilled.match(resultAction)) {
        console.log("Item added to cart:", resultAction.payload);
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
              title: <Link to="/fabrics">Fabrics</Link>,
            },
            {
              title: <>{singleproduct.name}</>,
            },
          ]}
        />
        <h2 className="heading">{singleproduct.name}</h2>
        {singleproduct.price && (
          <h2 className="heading">{singleproduct.price}</h2>
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
        </div>
        <div className="product_description">{singleproduct.description}</div>
        <h2 className="colors_heading">Colours Available</h2>
        <div
          className="colors_container"
          style={{ display: "flex", gap: "10px" }}>
          {singleproduct.product_colors &&
            singleproduct.product_colors.map((obj) => (
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
                }}>
                {}
              </div>
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
              disabled={inputQuantity >= singleproduct.stock_quantity}>
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
