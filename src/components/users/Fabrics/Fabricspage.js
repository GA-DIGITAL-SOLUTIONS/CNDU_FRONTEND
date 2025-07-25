import React, { useEffect, useState } from "react";
import { Slider, Card, Button, Pagination, message } from "antd";
import "./Fabricspage.css";
import { useDispatch, useSelector } from "react-redux";
import Specialdealscard from "../cards/Specialdealscard";
import Heading from "../Heading/Heading";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { Link, useSearchParams } from "react-router-dom";
import Loader from "../../Loader/Loader";
import {
  addWishlistItem,
  removeWishlistItem,
} from "../../../store/wishListSlice";
import axios from "axios";

const { Meta } = Card;

const Fabricspage = () => {
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [Filters, setFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [wishlistItemIds, SetWishlistItemIds] = useState([]);

  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const pageSize = 9;

  useEffect(() => {
    const fetchPaginatedFabrics = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          page_size: pageSize,
        });

        if (priceRange) {
          params.append("price_min", priceRange[0]);
          params.append("price_max", priceRange[1]);
        }
        if (selectedColor) {
          params.append("color_hex", selectedColor);
        }

        const response = await axios.get(`${apiurl}/paginated/fabrics/`, {
          params,
        });
        setProducts(response.data.results);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching paginated fabrics:", error);
        setLoading(false);
      }
    };
    fetchPaginatedFabrics();
  }, [currentPage, priceRange, selectedColor]);

  useEffect(() => {
    if (access_token) {
      fetchWishlistItemIds();
    }
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(10, 10);
  }, [currentPage]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const handleColorClick = (color) => {
    if (selectedColor === color) {
      setSelectedColor(null);
    } else {
      setSelectedColor(color);
    }
    setCurrentPage(1);
  };

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

  const togglefilters = () => {
    setFilters(!Filters);
  };

  const displayedProducts = products;

  const [uniqueColors, setUniqueColors] = useState([]);
  useEffect(() => {
    const fetchAllColors = async () => {
      try {
        const response = await axios.get(`${apiurl}/colors/`);
        const allColors = response.data;
        const uniqueColors = allColors.filter(
          (color, idx, self) =>
            self.findIndex((c) => c.hexcode === color.hexcode) === idx
        );
        setUniqueColors(uniqueColors);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };
    fetchAllColors();
  }, []);

  const handleWishlist = (id, text) => {
    if (!access_token) {
      return message.warning("please login to add items in wishlist");
    }
    if (text == "remove") {
      console.log("remove", id);
      const itemId = id;
      dispatch(removeWishlistItem({ apiurl, access_token, itemId }))
        .unwrap()
        .then(() => {
          if (access_token) {
            fetchWishlistItemIds();
          }
        });
    } else {
      console.log("add", id);
      const item = {
        item_id: id,
      };

      dispatch(addWishlistItem({ apiurl, access_token, item }))
        .unwrap()
        .then(() => {
          if (access_token) {
            fetchWishlistItemIds();
          }
        });
    }
  };

  const handlePageChange = (page) => {
    setSearchParams({ page: page });
    setCurrentPage(page);
  };

  return (
    <div className="products-page" style={{ position: "relative" }}>
      {loading && (
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
                      width: selectedColor === color?.hexcode ? "41px" : "40px",
                      height:
                        selectedColor === color?.hexcode ? "41px" : "40px",
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
          {displayedProducts.length === 0 ? (
            <div className="no-products">
              <h1>No matching products found.</h1>
              <p>Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="products-main-cont">
                {displayedProducts?.map((product) => {
                  const firstColorImage =
                    product.product_colors?.[0]?.images?.[0]?.image ||
                    product.image;
                  const firstPrice = product.product_colors?.[0]?.price;
                  const firstdiscount =
                    product.product_colors?.[0]?.discount_price;

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
                  const pre_book_eligible = firstcolorobjj?.pre_book_eligible;
                  const firstImage=`${apiurl}${firstColorImage}`

                  return (
                    <>
                      <div className="product-obj-card">
                        {isWishlisted ? (
                          <Button
                            className="prod-wishlist"
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
                            className="prod-wishlist"
                            onClick={() =>
                              handleWishlist(firstcolorobjj?.id, "add")
                            }
                          >
                            <HeartOutlined style={{ color: "#F24C88" }} />
                          </Button>
                        )}
                        <Card
                          className="product-item"
                          cover={
                            <Link to={`/fabrics/${product.id}`}>
                              <LazyLoadImage
                               key={firstImage} 
                                alt={product.name}
                                src={`${firstImage}`}
                                effect="blur"
                                // visibleByDefault={true} // 👈 this forces it to show even before scroll
                                height="300px"
                                width="100%"
                                style={{
                                  width: "100%",
                                  height: "300px",
                                  borderRadius: "10px",
                                  objectFit: "cover",
                                  display: "block",
                                  backgroundColor: "#f0f0f0", // 👈 temporary background to see boundaries
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/fallback-image.jpg"; // optional
                                }}
                              />
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
                                      {pre_book_eligible && (
                                        <div>Make Pre-booking</div>
                                      )}
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
                                        Rs: {firstPrice}
                                      </span>
                                      <span style={{ margin: "0px" }}>
                                        Rs: {firstdiscount}
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
                                      Rs: {firstPrice}
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
                total={pagination.count}
                pageSize={pageSize}
                onChange={(page) => handlePageChange(page)}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fabricspage;
