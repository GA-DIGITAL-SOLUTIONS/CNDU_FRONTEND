import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../../store/productsSlice";
import productpageBanner from "./productpageBanner.png";
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

import "./SpecificProductpage.css";

const { Meta } = Card;

const SpecificProductpage = () => {
  const cartStoreItems = useSelector((state) => state.cart.items);
  console.log("cartStore", cartStoreItems);

  const Navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [imgno, setimgno] = useState(0);
  const [arrayimgs,setarrayimgs]=useState([])
  const { singleproduct, singleproductloading, singleproducterror } =
    useSelector((state) => state.products);

  console.log("singlepro", singleproduct);

  const { products } = useSelector((state) => state.products);
  const [selectedColorid, setselectedColorid] = useState(null);// here i need to add the default id 
  const[productColorId,selectProductColorId]=useState(null);


  useEffect(() => {
    if (singleproduct.product_colors && singleproduct.product_colors.length > 0 && !selectedColorid) {
      // Set the first color id as the default selected color if no color is selected
      const firstColorId = singleproduct.product_colors[0].color.id;
      handleColorSelect(firstColorId)
      selectProductColorId(singleproduct.product_colors[0].id)// seting id to send the cart bro 

      // console.log("Setting default color ID:", firstColorId);
      // Optionally, you can log the color name and images of the first color
    }
  }, [singleproduct.product_colors, selectedColorid]);
  const [inputQuantity, setinputQuantity] = useState(1);
  const [colorQuentity, setcolorQuentity] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Number of products per page
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Slice products based on current page
  const displayedProducts = products?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const { apiurl, access_token } = useSelector((state) => state.auth);
  const url = apiurl;
  useEffect(() => {
    dispatch(fetchProductById({ id, url }));
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
    // If the selected color exists, log the images and name
    if (selectedColorObj) {
      console.log("For this color:", selectedColorObj.color.name);
      console.log("Images for this color:", selectedColorObj.images);
      const imagesurls=selectedColorObj.images.map((imageobj)=>{
      return imageobj.image
      })
      setarrayimgs(imagesurls);
      setcolorQuentity(selectedColorObj.stock_quantity)
      console.log("quentity",selectedColorObj.stock_quantity)
      selectProductColorId(selectedColorObj.id)// adding the product_color id for cart,wishlist
    }
    // console.log("arrayimgs",arrayimgs)
  };
  

  // console.log(images)
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
    console.log("inc by 1 ");
    // console.log(quantity);
    if (inputQuantity < Number(colorQuentity)) {// here i need to change 
      // setQuantity(quantity + 1);
      setinputQuantity(inputQuantity + 1);

      handleQuantityChange("inc");
    }
  };

  // Decrease quantity function
  const decreaseQuantity = () => {
    if (inputQuantity > 1) {
      // setQuantity(quantity - 1);
      setinputQuantity(inputQuantity - 1);
      handleQuantityChange("dec");
    }
  };

  const handleQuentityInput = (e) => {
    const input = Number(e.target.value);
    console.log("input", input);
    const singlepro_quantity = Number(colorQuentity);
    setinputQuantity(input);
    if (input > singlepro_quantity) {
      console.log("quantity must be equal to ", colorQuentity);
      setinputQuantity(singlepro_quantity);
    } else if (input == 0) {
      console.log("quantity must be 1 or greater than one");
      setinputQuantity(1);
    }
  };

  const handleAddtoCart = async () => {
    console.log("add this item to cart ", singleproduct.id);
    console.log("add this item to cart ", singleproduct.stock_quantity);
    console.log("check type ", "product");

    const item = {
      item_id: productColorId,// here i am sending the id  product_color
      // type: "product",
      quantity: Number(inputQuantity),
    };
    try {
      const resultAction = await dispatch(
        addCartItem({ apiurl, access_token, item })
      );
      if (addCartItem.fulfilled.match(resultAction)) {
        console.log("Item added to cart:", resultAction.payload);
        Navigate("/cart");

        dispatch(fetchCartItems({ apiurl, access_token }));
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  return (
    <div className="specific_product_page">
      <img src={productpageBanner} className="productpageBanner" />
      <div className="product_imgs_detail_container">
        <div className="imgs_navigator">
          <div className="only_img">
            {arrayimgs.map((img, index) => (
              <img
                key={index}
                src={`${apiurl}${img}`}
                className={`nav_imgs ${imgno === index ? "selected_img" : ""}`}
                alt={`Nav Image ${index}`}
                onClick={() => handleimges(index)}
              />
            ))}
          </div>

          <div className="arrows">
            <img src={uparrow} onClick={handleUparrow} />
            <img src={downarrow} onClick={handleDownarrow} />
          </div>
        </div>
        {/* <h4>{imgno}</h4> */}
        <img src={`${apiurl}${arrayimgs[imgno]}`} className="pro_image" />
        <div className="details_container">
          <Breadcrumb
            separator=">"
            items={[
              {
                title: <Link to="/products">Home</Link>,
              },
              {
                title: <Link to="/products">Products</Link>,
              },
              {
                title: <Link to="/sharee">Sharee</Link>,
              },
            ]}
          />
          <h2 className="heading">{singleproduct.name}</h2>
          <div className="rating_and_comments">
            <div className="rating">
              <Rate allowHalf defaultValue={2.5} className="no-hover-rate" />
              <h3>{2.5}</h3>
            </div>
            <div className="comments">
              <img src={commentsicon} />
              <h3>{120} comments</h3>
            </div>
          </div>
          <h2 className="colors_heading">Colours Available</h2>
          <div
            className="colors_container"
            style={{ display: "flex", gap: "10px" }}
          >
            {singleproduct.product_colors&&
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
                      selectedColorid === obj.color.id ? "2px solid #F24C88" : "",
                  }}
                >
                  {/* This div represents the color */}
                </div>
              ))}
          </div>
          <div className="cart_quentity">
            <button className="cart_but" onClick={handleAddtoCart}>
              <i
                className="fas fa-shopping-cart"
                style={{ marginRight: "8px", color: "white" }}
              ></i>
              Add to cart
            </button>

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
                type="text"
                value={inputQuantity}
                onChange={handleQuentityInput}
                // placeholder="Enter a number"
              />

              <Button
                className="inc_but"
                onClick={increaseQuantity}
                disabled={inputQuantity >= singleproduct.stock_quantity}
              >
                +
              </Button>
            </div>
          </div>
          <div className="product_items">
            <div className="item1">
              <img src={secureicon} />
              <h2>Secure payment</h2>
            </div>
            <div className="item1">
              <img src={secureicon} />
              <h2>Secure payment</h2>
            </div>
            <div className="item1">
              <img src={secureicon} />
              <h2>Secure payment</h2>
            </div>
            <div className="item1">
              <img src={secureicon} />
              <h2>Secure payment</h2>
            </div>
          </div>
          {/* details_container */}
        </div>
      </div>
      <div className="product_description_video">
        <div className="product_description_container">
          <h1>Product Description</h1>
          <div className="product_description">
            <div className="product_d">
              <h3>Fabric</h3>
              <h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
                Secure payment
              </h2>
            </div>
            <div className="product_d">
              <h3>Work</h3>
              <h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
                Secure payment
              </h2>
            </div>
            <div className="product_d" style={{ borderRight: "none" }}>
              <h3>Pattern</h3>
              <h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
                Secure payment
              </h2>
            </div>
            <div
              className="product_d"
              style={{ borderLeft: "none", borderBottom: "none" }}
            >
              <h3>Panna</h3>
              <h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
                Secure payment raa nayana{" "}
              </h2>
            </div>
            <div className="product_d" style={{ borderBottom: "none" }}>
              <h3>Wash</h3>
              <h2 style={{ fontSize: "1.2em" }}>Secure payment</h2>
            </div>
            <div
              className="product_d"
              style={{ borderRight: "none", borderBottom: "none" }}
            >
              <h3>Size</h3>
              <h2 style={{ fontSize: "1.2em", textAlign: "center" }}>
                Secure payment
              </h2>
            </div>
          </div>
        </div>
        {/* <video src="./"></video> */}
        <img className="video" src={productpageBanner}></img>
      </div>
      {/* from here you can remove  */}
      <div>
        <div
          className="products-container"
          style={{
            marginLeft: "50px",
          }}
        >
          <Heading>Related Products</Heading>
          <Row gutter={[14, 14]}>
            {/* Check if products are loaded and display them */}
            {displayedProducts?.map((product) => (
              <Col span={6} key={product.id}>
                <Card
                  cover={
                    <Link to={`/Home/product/${product.id}`}>
                      <img
                        alt={product.name}
                        src={`${apiurl}/${product.image}`}
                        style={{
                          cursor: "pointer",
                          width: "100%", // Ensures the image takes up the full width of its container
                          height: "200px", // Set a fixed height as needed
                          objectFit: "cover", // This will crop the image to fit the container without stretching
                          borderRadius: "10px",
                        }}
                      />
                    </Link>
                  }
                >
                  <div className="product-info">
                    <Meta
                      title={
                        <Link
                          to={`/Home/product/${product.id}`}
                          style={{ color: "inherit", textDecoration: "none" }}
                        >
                          {product.name}
                        </Link>
                      }
                      description="In stock"
                    />
                    <Button
                      type="primary"
                      icon={<DollarOutlined />}
                      style={{
                        width: "45%",
                        backgroundColor: "#F6F6F6",
                        color: "#3C4242",
                      }}
                    >
                      ${product.price}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <Pagination
            current={currentPage}
            total={products?.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            className="custom-pagination"
            style={{ marginTop: "20px", marginBottom: "20px" }}
            itemRender={(page, type, originalElement) => {
              if (type === "prev") {
                return (
                  <img
                    src="/Paginationleftarrow.svg" // Public folder path
                    alt="Previous"
                    style={{ width: "20px" }}
                  />
                );
              }
              if (type === "next") {
                return (
                  <img
                    src="/Paginationrightarrow.svg" // Public folder path
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
