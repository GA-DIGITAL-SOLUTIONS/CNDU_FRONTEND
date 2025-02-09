import React, { useEffect, useState } from "react";
import { Slider, Card, Button, Pagination } from "antd";
import "./Fabricspage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchFabrics, fetchProducts } from "../../../store/productsSlice";
import Specialdealscard from "../cards/Specialdealscard";
import Heading from "../Heading/Heading";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

import { Link } from "react-router-dom";
import Loader from "../../Loader/Loader";
import {
  addWishlistItem,
  removeWishlistItem,
} from "../../../store/wishListSlice";

const { Meta } = Card;

const Fabricspage = () => {
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [Filters, setFilters] = useState(false);

  const [filter, setFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [firtsColorQuantity, setFirtsColorQuantity] = useState(null);
  const [Products, SetProducts] = useState([]);
  const [wishlistItemIds, SetWishlistItemIds] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchWishlistItemIds();
    dispatch(fetchFabrics());
    dispatch(fetchProducts());
  }, [dispatch]);

  const { products, fabrics, fabricsloading, fabricserror } = useSelector(
    (store) => store.products
  );
  const { apiurl, access_token } = useSelector((state) => state.auth);

  useEffect(() => {
    const pros = fabrics.filter((product) => {
      return product.is_active; // Only include products where is_active is true
    });

    SetProducts(pros); // Set the filtered products to state
  }, [fabrics]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    window.scrollTo(10, 10);
  }, [currentPage]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
    handleFilters();
  };

  const handleColorClick = (color) => {
    console.log("color", color);
    if (selectedColor == color) {
      setFilter(false);
      setSelectedColor(null);
    } else {
      setSelectedColor(color);
    }
  };
  // console.log("access_token",access_token)

  const fetchWishlistItemIds = async () => {
    try {
      const response = await fetch(`${apiurl}/wishlist/itemids/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Wishlist Item IDs:", data?.wishlist_id_array);
      SetWishlistItemIds(data?.wishlist_id_array);
      // return data;
    } catch (error) {
      console.error("Error fetching wishlist item IDs:", error);
    }
  };

  // Call the function

  useEffect(() => {
    if (selectedColor != null) {
      handleFilters();
    }
  }, [selectedColor]);

  // useEffect(()=>{
  //   if(selectedColor==null){
  //     // handleFilters();
  //   }
  // },[selectedColor])

  const togglefilters = () => {
    setFilters(!Filters);
  };

  const handleFilters = () => {
    const filtered = Products.filter((product) => {
      const colorPriceMatch = product.product_colors?.some((colorObj) => {
        const colorMatch = selectedColor
          ? colorObj.color.hexcode === selectedColor
          : true;
        const priceMatch =
          colorObj.price >= priceRange[0] && colorObj.price <= priceRange[1];

        return colorMatch && priceMatch;
      });

      return colorPriceMatch;
    });

    setFilteredProducts(filtered);
    setFilter(true);
    setCurrentPage(1);
  };

  const totalProducts = filter ? filteredProducts.length : Products.length;

  const displayedProducts = (filter ? filteredProducts : Products)?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const productColors = Products.map((product) => {
    return product.product_colors;
  });

  const allColors = productColors.flatMap((Pcobj) =>
    Pcobj.map((singlcolor) => singlcolor.color)
  );

  const uniqueColors = allColors.filter(
    (color, idx, self) =>
      self.findIndex((c) => c.hexcode === color.hexcode) === idx
  );




  const handleWishlist = (id, text) => {
    if (text == "remove") {
      console.log("remove", id);
      const itemId = id;
      dispatch(removeWishlistItem({ apiurl, access_token, itemId }))
        .unwrap()
        .then(() => {
          fetchWishlistItemIds();
        });
    } else {
      console.log("add", id);
      const item = {
        item_id: id,
      };

      dispatch(addWishlistItem({ apiurl, access_token, item }))
        .unwrap()
        .then(() => {
          fetchWishlistItemIds();
        });
    }
  };

  

  return (
    <div className="products-page" style={{ position: "relative" }}>
      {fabricsloading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Loader />
        </div>
      )}

      {/* Main Content */}
      <img
        src="./productpageBanner.png"
        className="productpageBanner"
        alt="Product Page Banner"
      />

      <div className="filter-products-container">
        <div className="filter-container">
          <div className="filter">
            <div className="first-div">
              <b>
                <h5>Filter Options</h5>
              </b>
              <img
                style={{ cursor: "pointer" }}
                src={Filters ? "./changefilter.svg" : "./changefilter2.svg"}
                alt="filter-icon"
                onClick={togglefilters}
              />
            </div>

            <div className="price-div">
              <b>
                <h5>Price</h5>
              </b>
            </div>

            {Filters && (
              <div className="price-content">
                <Slider
                  className="custom-slider"
                  range
                  min={0}
                  max={20000}
                  step={50}
                  trackStyle={{
                    borderColor: "#000",
                    backgroundColor: "#fff",
                  }}
                  value={priceRange}
                  onChange={handlePriceChange}
                />
                <p>
                  Range: Rs {priceRange[0]} - Rs {priceRange[1]}
                </p>
              </div>
            )}

            <div className="color-div">
              <b>
                <h5>Colors</h5>
              </b>
            </div>

            {Filters && (
              <div className="color-content">
                {uniqueColors.map((color) => (
                  <div
                    key={color?.hexcode}
                    className="color-box"
                    style={{
                      backgroundColor: color?.hexcode,
                      border:
                        selectedColor === color?.hexcode
                          ? "2px solid #f24c88"
                          : "1px solid #ddd",
                      width: selectedColor === color?.hexcode ? "45px" : "40px",
                      height:
                        selectedColor === color?.hexcode ? "45px" : "40px",
                      borderRadius: "30px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleColorClick(color?.hexcode)}
                  >
                    <div className="color-box-tooltip">{color?.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <img
            src="./Maryqueen.png"
            className="Maryqueen"
            alt="filter-cndu"
          ></img>
        </div>
        <div className="products-container">
          <div className="products-main-cont">
            {displayedProducts?.map((product) => {
              const firstColorImage =
                product.product_colors?.[0]?.images?.[0]?.image ||
                product.image;
              const firstPrice = product.product_colors?.[0]?.price;

              const firstdiscount = product.product_colors?.[0]?.discount_price;
              const firstColorQuantity =
                product.product_colors?.[0]?.stock_quantity;
              const otherColorsExist =
                product.product_colors?.length > 1 ? true : false;

              const firstcolorobjj = product.product_colors?.[0];
              const wishlistedItem = wishlistItemIds.find(
                (item) => item.item_id == firstcolorobjj?.id
              );
              console.log("wishlistedItem", wishlistedItem);
              const isWishlisted = Boolean(wishlistedItem); 

              return (
                <>
                  <div>
                      {isWishlisted ? (
                        <Button
                          className="sp-prd-heartbtn"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50px",
                            backgroundColor: "gray",
                            // opacity: "40%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            top: "44px",
                            left: "253px",
                            zIndex: "15",
                          }}
                          onClick={() =>
                            handleWishlist(
                              wishlistedItem?.wishlist_id,
                              "remove"
                            )
                          }
                        >
                          <HeartFilled style={{ color: "#F24C88" }} />
                        </Button>
                      ) : (
                          <Button
                          className="sp-prd-heartbtn"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50px",
                            // backgroundColor: "gray",
                            // opacity: "40%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            top: "44px",
                            left: "253px",
                            zIndex: "15",
                          }}
                          onClick={() =>
                            handleWishlist(firstcolorobjj?.id, "add")}
                        >
                          <HeartOutlined style={{ color: "#F24C88" }} />
                        </Button>
                      )}

                    <Card
                      className="product-item"
                      cover={
                        <Link to={`/fabrics/${product.id}`}>
                          {/* <div style={{display:"flex"}}> */}

                          <img
                            alt={product.name}
                            src={`${apiurl}${firstColorImage}`}
                            style={{
                              cursor: "pointer",
                              width: "100%",
                              borderRadius: "10px",
                              objectFit: "cover",
                            }}
                          />
                          {/* </div> */}
                        </Link>
                      }
                    >
                      <div className="product-info">
                        <Meta
                          title={
                            <Link
                              to={`/fabrics/${product.id}`}
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
                              {product.name}
                            </Link>
                          }
                          description={
                            <div className="prod-desc">
                              {firstColorQuantity > 0 ? (
                                <div>In stock</div>
                              ) : otherColorsExist ? (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div
                                    style={{
                                      color: "orange",
                                      fontWeight: "bolder",
                                    }}
                                  >
                                    Color Out of Stock
                                  </div>
                                  <div style={{ color: " #28a745" }}>
                                    Check Other Colors
                                  </div>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div
                                    style={{
                                      color: "red",
                                      fontWeight: "bolder",
                                    }}
                                  >
                                    Out of Stock
                                  </div>
                                  <div>Make Pre-booking</div>
                                </div>
                              )}
                              {firstdiscount < firstPrice &&
                              firstdiscount != 0 ? (
                                // Button when there is a discount
                                <Button
                                  type="primary"
                                  style={{
                                    width: "50%",
                                    backgroundColor: "#F6F6F6",
                                    color: "#3C4242",
                                    display: "flex",
                                    // flexDirection: "column",
                                    gap: "5px",
                                    // alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      color: "red",
                                      fontSize: "10px",
                                      // margin:"0px"
                                    }}
                                  >
                                    Rs: {Number(firstPrice)}
                                  </span>
                                  <span style={{ margin: "0px" }}>
                                    Rs: {Number(firstdiscount)} / m
                                  </span>
                                </Button>
                              ) : (
                                // Button when there is no discount
                                <Button
                                  type="primary"
                                  style={{
                                    width: "40%",
                                    backgroundColor: "#F6F6F6",
                                    color: "#3C4242",
                                  }}
                                >
                                  Rs: {Number(firstPrice)} / meter
                                </Button>
                              )}
                            </div>
                          }
                        />
                      </div>
                    </Card>
                  </div>
                </>
              );
            })}
          </div>

          <Pagination
            current={currentPage}
            total={totalProducts}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
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

export default Fabricspage;
