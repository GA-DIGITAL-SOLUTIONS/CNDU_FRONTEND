import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSareeById,
  fetchProducts,
  fetchOfferProducts,
  fetchSarees,
} from "../../../store/productsSlice";


import { Link } from "react-router-dom";
import { Button, Slider } from "antd";

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

import FetchCostEstimates from "../cards/Estimations";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import FirstAniversarySale from "../Body/Section1/FirstAniversarySale";

const { Meta } = Card;

const Offerspage = () => {
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [priceExpanded, setPriceExpanded] = useState(false);
  const [Filters, setFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColors, setModalColors] = useState([]);
  const [colorExpanded, setColorExpanded] = useState(false);
  const [hoveredColor, setHoveredColor] = useState(null);
  const [filter, setFilter] = useState(false);
  const [isFilter, setIsFilter] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [offerTypes, setOfferTypes] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [wishlistItemIds, SetWishlistItemIds] = useState([]);

  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const pageSize = 9;



    const handlePageChange=(page)=>{
    setSearchParams({ page: page });
    setCurrentPage(page)
  }

  useEffect(() => {
    const fetchPaginatedOffers = async () => {
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
        selectedOffers.forEach((offer) => params.append("offer_type", offer));

        const response = await axios.get(`${apiurl}/paginated/offers/`, {
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
        console.error("Error fetching paginated offers:", error);
        setLoading(false);
      }
    };
    fetchPaginatedOffers();
  }, [currentPage, priceRange, selectedColor, selectedOffers]);

  useEffect(() => {
    if (access_token) {
      fetchWishlistItemIds();
    }
  }, [dispatch]);

  useEffect(() => {
    if (products && Array.isArray(products)) {
      const offertypes = products.map((product) => ({
        name: product.offer_type,
      }));
      setOfferTypes(
        offertypes
          .filter((obj) => obj.name)
          .filter(
            (obj, index, self) =>
              self.findIndex((o) => o.name === obj.name) === index
          )
      );
    }
  }, [products]);

  useEffect(() => {
    window.scrollTo(10, 10);
  }, [currentPage]);

  const handleColorClick = (colorHex) => {
    setSelectedColor((prevColor) => (prevColor === colorHex ? null : colorHex));
    setCurrentPage(1);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (name) => {
    setSelectedOffers((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((offer) => offer !== name)
        : [...prevSelected, name]
    );
    setCurrentPage(1);
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
    } catch (error) {
      console.error("Error fetching wishlist item IDs:", error);
    }
  };

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

  const formatOfferName = (name) => {
    const offerLabels = {
      last_pieces: "Last Pieces",
      miss_prints: "Miss Prints",
      weaving_mistakes: "Weaving Mistakes",
      negligible_damages: "Negligible Damages",
    };

    return offerLabels[name] || name;
  };

  return (
    <div className="products-page" style={{ position: "relative" }}>
      {}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "60%",
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

      {/* <img
        src="./productpageBanner.png"
        className="productpageBanner"
        alt="Product Page Banner"
      /> */}
      <FirstAniversarySale  where={"otherbanners"}/>
      <div className="filter-products-container">
        <div className="filter-container">
          <div className="filter">
            <div className="first-div">
              <b>
                <h5>Filter Options</h5>
              </b>
              <b></b>
              <img
                src={Filters ? "./changefilter.svg" : "./changefilter2.svg"}
                style={{ cursor: "pointer" }}
                alt="filter-icon"
                onClick={togglefilters}
              />
            </div>
            <div className="price-div">
              <b>
                <h5>Types</h5>
              </b>
            </div>
            {Filters && (
              <div className="price-content">
                {offerTypes.map((obj, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        paddingLeft: "0px",
                        wordWrap: "break-word",
                        maxWidth: "200px",
                      }}
                    >
                      <input
                        type="checkbox"
                        value={obj.name}
                        checked={selectedOffers.includes(obj.name)}
                        onChange={() => handleCheckboxChange(obj.name)}
                        style={{
                          marginRight: "8px",
                          cursor: "pointer",
                        }}
                      />
                      {formatOfferName(obj.name)}
                    </label>
                  </div>
                ))}
              </div>
            )}

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
                    {}
                    <div className="color-box-tooltip">{color?.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <img src="./Maryqueen.png" className="Maryqueen" alt="filter" />
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
              const pre_book_eligible = firstcolorobjj?.pre_book_eligible;
                  const firstImage = `${apiurl}${firstColorImage}`;

              return (
                <>
                  <div className="product-obj-card">
                    {isWishlisted ? (
                      <Button
                        className="prod-wishlist"
                        onClick={() =>
                          handleWishlist(wishlistedItem?.wishlist_id, "remove")
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
                        <Link to={`/offers/${product.id}`}>
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
                              to={`/offers/${product.id}`}
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
                                <Button
                                  type="primary"
                                  style={{
                                    width: "50%",
                                    backgroundColor: "#F6F6F6",
                                    color: "#3C4242",
                                    gap: "5px",
                                  }}
                                >
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      color: "red",
                                      fontSize: "10px",
                                    }}
                                  >
                                    Rs: {firstPrice}
                                  </span>
                                  <span style={{ margin: "0px" }}>
                                    Rs: {firstdiscount}
                                  </span>
                                </Button>
                              ) : (
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
        </div>
      </div>
    </div>
  );
};

export default Offerspage;
