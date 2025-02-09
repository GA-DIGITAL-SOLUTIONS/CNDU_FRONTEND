import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFabrics } from "../../../store/productsSlice";
import productpageBanner from "./images/productpageBanner.png";
import uparrow from "./images/uparrow.svg";
import downarrow from "./images/uparrow.svg";
import { Link } from "react-router-dom";
import { Breadcrumb, Rate, Button } from "antd";
import secureicon from "./images/SecurepaymentIcon.svg";
import { Slider, Card,  Pagination, message } from "antd";
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
  removeWishlistItem,
} from "../../../store/wishListSlice";
import Loader from "../../Loader/Loader";
// import './FabricSpecificage.css'

const { Meta } = Card;

const FabricSpecificPage = () => {
  const dispatch = useDispatch();

  const Navigate = useNavigate();
  const { id } = useParams();

  const [singleFabric, setSingleFabric] = useState([]);

  const { fabrics } = useSelector((state) => state.products);
  // console.log("singlepro", singleFabric);
  // console.log("fabrics", fabrics);
  const [wishlistmatchedProductColorIds, setwishlistmatchedProductColorIds] =
    useState([]);
  const [imgno, setimgno] = useState(0);
  const [arrayimgs, setarrayimgs] = useState([]);
  const [productColorId, selectProductColorId] = useState(null);
  const [inputQuantity, setinputQuantity] = useState(1);
  const [selectedColorid, setselectedColorid] = useState(null);
  const [msg, setMessage] = useState("");
  const [singlefarbicloading, setsinglefarbicloading] = useState(false);
  const [productColorPrice, selectProductColorPrice] = useState(null);
  const [productColorPercentage, selectProductColorPercentage] = useState(null);
  const [productColorDiscount, selectproductColorDiscount] = useState(null);

  const [colorStock, setColorStock] = useState(null);
  const [isColorPrebook, setIsColorPrebook] = useState(false);
  const [colorPrebookStock, setPrebookStock] = useState(false);

  const { apiurl, access_token, userRole } = useSelector((state) => state.auth);
  const { addCartItemloading, addCartItemerror } = useSelector(
    (state) => state.cart
  );

  const { items } = useSelector((state) => state.wishlist);

  useEffect(() => {
    fetchFabricdata({ id, apiurl });
    dispatch(fetchWishlistItems({ apiurl, access_token }));
  }, [id]);

  console.log("items",items);

  useEffect(() => {
    dispatch(fetchFabrics());
  }, [dispatch, id]);

  useEffect(() => {
    let matchedProductColorIds = [];
    items?.forEach((obj) => {
      const matchingColor = singleFabric?.product_colors?.find(
        (p_c_obj) => p_c_obj.id === obj.item.id
      );
      if (matchingColor) {
        matchedProductColorIds.push(matchingColor.id);
      }
    });
    setwishlistmatchedProductColorIds(matchedProductColorIds);
  }, [items, dispatch, selectedColorid]);

  const fetchFabricdata = async ({ id, apiurl }) => {
    // console.log("Fetching fabric by ID:", id);
    setsinglefarbicloading(true);

    try {
      const response = await fetch(`${apiurl}/products/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Network response was not ok");
      }
      setsinglefarbicloading(false);
      const data = await response.json();
      // console.log("Fetched fabric data:", data);
      // return data;
      setSingleFabric(data);
    } catch (error) {
      setsinglefarbicloading(false);
      console.error("Error fetching fabric:", error.msg);
      throw error;
    }
  };

  // useEffect(() => {
  //   if ( singleFabric?.product_colors?.length > 0 &&
  //     !selectedColorid
  //   ) {
  //     const firstColorId = singleFabric.product_colors[0].color.id;
  //     const firstColorObj=singleFabric.product_colors[0]
  //     console.log("firstColorObj",firstColorObj)
  //     const imagesurls = firstColorObj.images.map((imageobj) => {
  //       return imageobj.image;
  //     });
  //     console.log("imagesurls",imagesurls)
  //     setarrayimgs(imagesurls);
  //     handleColorSelect(firstColorId);
  //     selectProductColorId(singleFabric.product_colors[0].id);
  //   }
  // }, [singleFabric?.product_colors, selectedColorid, id, dispatch]);

  useEffect(() => {
    if (singleFabric?.product_colors?.length > 0) {
      const firstColorId = singleFabric?.product_colors[0]?.color?.id;
      const firstColorObj = singleFabric?.product_colors[0];
      // console.log("firstColorObj", firstColorObj);
      const imagesurls = firstColorObj?.images.map((imageobj) => {
        return imageobj.image;
      });
      // console.log("imagesurls", imagesurls);
      setarrayimgs(imagesurls);
      handleColorSelect(firstColorId);
      // console.log("firstColorId", firstColorId);
      // console.log("for border", productColorId);
      selectProductColorId(firstColorObj.id);

      selectProductColorPrice(singleFabric?.product_colors[0]?.price);
      selectproductColorDiscount(
        singleFabric?.product_colors[0]?.discount_price
      );
      selectProductColorPercentage(
        singleFabric?.product_colors[0]?.discount_percentage
      );

      setColorStock(singleFabric?.product_colors[0]?.stock_quantity);
      setIsColorPrebook(singleFabric?.product_colors[0]?.pre_book_eligible);
      setPrebookStock(singleFabric?.product_colors[0]?.pre_book_quantity);
    }
  }, [id, dispatch, singleFabric]);

  // console.log("colorPrebookStock", colorPrebookStock);

  const [colorQuentity, setcolorQuentity] = useState(null);
  const [Fabrics, SetFabrics] = useState(null);



  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const pros = fabrics?.filter((product) => {
      return product?.is_active && product?.id !== singleFabric?.id;
    });
  
    SetFabrics(pros);
  }, [fabrics, singleFabric]);
  

  const displayedProducts = Fabrics?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // console.log("displayedProducts",displayedProducts)

  const handleUparrow = () => {
    // console.log("imgno", imgno);
    if (imgno > 0) {
      setimgno(imgno - 1);
    } else if (imgno <= 0) {
      setimgno(imgno + arrayimgs.length - 1);
    }
  };

  const handleDownarrow = () => {
    // console.log("imgno", imgno);
    if (imgno < arrayimgs.length - 1) {
      setimgno(imgno + 1);
    } else if (imgno >= arrayimgs.length - 1) {
      setimgno(0);
    }
  };
  const handleimges = (idx) => {
    setimgno(idx);
    // console.log("idx", idx);
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
      selectProductColorPrice(selectedColorObj?.price);
      selectproductColorDiscount(selectedColorObj?.discount_price);
      selectProductColorPercentage(selectedColorObj?.discount_percentage);
      selectProductColorId(selectedColorObj.id);
      setinputQuantity(1);
      setColorStock(selectedColorObj?.stock_quantity);
      setIsColorPrebook(selectedColorObj?.pre_book_eligible);
      setPrebookStock(selectedColorObj?.pre_book_quantity);
    }
  };


  const increaseQuantity = () => {
    // Determine the increment value based on allow_zeropointfive
    const increment = singleFabric?.allow_zeropointfive ? 0.5 : 1;
    const newQuantity = Number(inputQuantity) + increment;
  
    // Check if the new quantity exceeds the color stock
    if (Number(colorStock) < newQuantity) {
      message.info(
        `You have reached the maximum quantity of ${Number(colorStock)}.`
      );
      return;
    }
  
    setinputQuantity(newQuantity);
  };
  

  const increaseprebookquantity = () => {
    const increment = singleFabric?.allow_zeropointfive ? 0.5 : 1;

    const newQuantity = Number(inputQuantity) + increment;

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
    const decrement = singleFabric?.allow_zeropointfive ? 0.5 : 1;
    
    const newQuantity = Number(inputQuantity) - decrement;
    if (newQuantity >= 0.5) {
      setinputQuantity(newQuantity);
    }
  };

  const handleQuentityInput = (e) => {
    let newQuantity = Number(e.target.value);
  
    // Determine the step value based on allow_zeropointfive
    const step = singleFabric?.allow_zeropointfive ? 0.5 : 1;
  
    // Round the entered value to the nearest valid step
    newQuantity = Math.round(newQuantity / step) * step;
  
    // Ensure the new quantity does not exceed stock
    if (newQuantity > Number(colorStock)) {
      message.info(
        `You have reached the maximum quantity of ${Number(colorStock)}.`
      );
      return;
    }
  
    setinputQuantity(newQuantity);
  };
  

  const handleQuentityInputprebook = (e) => {
    const newQuantity = e.target.value;
    const step = singleFabric?.allow_zeropointfive ? 0.5 : 1;
    newQuantity = Math.round(newQuantity / step) * step;
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

  const handleWishList = async () => {
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
      // console.log("access_token", access_token);
      try {
        await dispatch(addWishlistItem({ apiurl, access_token, item }))
          .unwrap()
          .then(() => {
            message.success("Item successfully added to the wishlist!");
            dispatch(fetchWishlistItems({ apiurl, access_token }));
          });
      } catch (error) {
        message.error("Please Login To Add Items In Wishlist");
        console.error(error);
      }
    }
  };

  const handleAddtoCart = async () => {
    // console.log("productColorId", productColorId);
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


  const url = singleFabric?.youtubeLink;
  const videoId = url?.split("/").pop().split("?")[0] || null;

  if (singlefarbicloading) {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <Loader />
      </div>
    );
  }

  // console.log("singleFabric?.product_colors?.length",singleFabric?.product_colors?.length)
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
                  onClick={handleWishList}
                >
                  <HeartFilled style={{ color: "#F24C88" }} />
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
                title: <Link to="/fabrics">Fabrics</Link>,
              },
              {
                title: <>{singleFabric.name}</>,
              },
            ]}
          />
          <h2 className="heading">{singleFabric.name}</h2>
          {singleFabric?.product_colors &&
            singleFabric?.product_colors.length > 0 && (
              <div>
                {productColorDiscount < productColorPrice &&  !(productColorDiscount==0)? (
                  <div style={{marginBottom:"10px"}}>
                    <h2
                    className="heading"
                      style={{
                        textDecoration: "line-through",
                        color: "red",
                        marginRight: "8px",
                      }}
                    >
                      ₹{Number(productColorPrice)}

                    </h2>
                    <h2 
                    className="heading"
                    style={{ display: "inline", color: "green" }}>
                      {" "}
                      ₹{Number(productColorDiscount)}
                    <span style={{marginLeft:"10px"}}> per meter</span>

                    </h2>
                  </div>
                ) : (
                  <h2 className="heading">
                    ₹{Number(productColorPrice)} <span>per meter</span>
                  </h2>
                )}
              </div>
            )}

          {colorStock <= 0 ? (
            <div
              style={{
                marginBottom: "20px",
                fontWeight: "600",
                color: "red",
                fontSize: "x-large",
              }}
            >
             {singleFabric?.product_colors?.length>1?"color out of stock":
             
             "out of stock"
             }
            </div>
          ) : (
            ""
          )}

          <div className="rating_and_comments">
            <div className="rating">
              <Rate
                allowHalf
                disabled
                allowClear={false}
                value={singleFabric?.avg_rating || 0}
                className="no-hover-rate"
              />
              <h3>{singleFabric.total_reviews || 0} Reviews</h3>
            </div>
          </div>

          <h2 className="colors_heading">Colours Available</h2>

          <div
            className="colors_container"
            style={{ display: "flex", gap: "10px" }}
          >
            {singleFabric.product_colors &&
              singleFabric.product_colors.map((obj) => (
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
                ></div>
              ))}
          </div>
          <div className="estimated-delivery-container">
            <h3>
              <strong>Estimated Delivery :</strong>
            </h3>
            <h3>Within 7-10 Days</h3>
          </div>
          <div className="cart_quentity">
            {colorStock <= 0 ? (
              isColorPrebook && // here need to check for the current variant
              colorPrebookStock > 0 ? ( // here need to check for the current variant
                <>
                  <Button
                    className="cart_but"
                    onClick={handleAddtoCart}
                    loading={addCartItemloading}
                  >
                    <i
                      className="fas fa-shopping-cart"
                      style={{ marginRight: "8px", color: "white" }}
                    ></i>
                    Pre-Booking
                  </Button>

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
                      step={singleFabric?.allow_zeropointfive ? 0.5 : 1}
                      value={inputQuantity}
                      onChange={handleQuentityInputprebook}
                    />
                    <Button
                      className="inc_but"
                      onClick={increaseprebookquantity}
                      disabled={inputQuantity > colorPrebookStock}
                    >
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
                  loading={addCartItemloading}
                >
                  <i
                    className="fas fa-shopping-cart"
                    style={{ marginRight: "8px", color: "white" }}
                  ></i>
                  Add to cart
                </Button>
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
                    step={singleFabric?.allow_zeropointfive ? 0.5 : 1}
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
              </>
            )}
          </div>
          <div className="product_description">
            <h2>Description</h2>
            <div
              className="desc-content"
              dangerouslySetInnerHTML={{
                __html: singleFabric.description,
              }}
            ></div>
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
        {videoId != null && (
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
            title="YouTube video"
          ></iframe>
        )}
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
                <div key={product.id}>
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
                            height: "340px",
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
                            {product.name > 24
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
            total={Fabrics?.length}
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
    </div>
  );
};

export default FabricSpecificPage;
