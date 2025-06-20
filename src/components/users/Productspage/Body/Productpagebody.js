import React, { useEffect, useState } from "react";
import {
  Slider,
  Card,
  Row,
  Col,
  Button,
  Pagination,
  Model,
  message,
} from "antd";
import "./Productpagebody.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchSarees } from "../../../../store/productsSlice";
import Specialdealscard from "../../cards/Specialdealscard";
import { Link } from "react-router-dom";
import Heading from "../../Heading/Heading";
import Loader from "../../../Loader/Loader";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import {
  addWishlistItem,
  removeWishlistItem,
} from "../../../../store/wishListSlice";
import axios from 'axios';

const { Meta } = Card;

const Productpagebody = () => {
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [priceExpanded, setPriceExpanded] = useState(false);
  const [Filters, setFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColors, setModalColors] = useState([]);
  const [colorExpanded, setColorExpanded] = useState(false);
  const [hoveredColor, setHoveredColor] = useState(null);
  const [filter, setFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlistItemIds, SetWishlistItemIds] = useState([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    const fetchPaginatedProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          page_size: pageSize,
        });
        if (priceRange) {
          params.append('price_min', priceRange[0]);
          params.append('price_max', priceRange[1]);
        }
        if (selectedColor) {
          params.append('color_hex', selectedColor);
        }

        const response = await axios.get(`${apiurl}/paginated/products/`, { params });
        setProducts(response.data.results);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching paginated products:", error);
        setLoading(false);
      }
    };

    fetchPaginatedProducts();
  }, [currentPage, priceRange, selectedColor]);

  useEffect(() => {
    fetchWishlistItemIds();
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

  const togglePrice = () => {
    setPriceExpanded(!priceExpanded);
  };

  const togglefilters = () => {
    setFilters(!Filters);
  };

  const toggleColor = () => {
    setColorExpanded(!colorExpanded);
  };

  const handleFilters = () => {
    // console.log("Selected filters:", priceRange, selectedColor);
    // console.log("Filtering based on product_colors -> price and color.name");

    const filtered = products?.filter((product) => {
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

    // console.log("Filtered Products:", filtered);
    setFilteredProducts(filtered);
    setFilter(true);
    setCurrentPage(1);
  };

  const totalProducts = filter ? filteredProducts.length : pagination.count;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const displayedProducts = filter ? filteredProducts : products;

  // console.log("Total Products:", totalProducts);
  // console.log("Total Pages:", totalPages);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [activeKey, setActiveKey] = useState(["1"]);

  const productColors = products.map((product) => {
    return product.product_colors;
  });
  // console.log("productColors", productColors);

  const allColors = productColors.flatMap((Pcobj) =>
    Pcobj.map((singlcolor) => singlcolor.color)
  );

  const uniqueColors = allColors.filter(
    (color, idx, self) =>
      self.findIndex((c) => c.hexcode === color.hexcode) === idx
  );

  // console.log("hoveredColor", hoveredColor);

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
      {/* Loading Spinner covering the whole page */}
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
                src={Filters ? "./changefilter.svg" : "./changefilter2.svg"}
                style={{ cursor: "pointer" }}
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
                    {/* Tooltip will appear when hovering over the color box */}
                    <div className="color-box-tooltip">{color?.name}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="clear-filter">
              <Button
                onClick={() => {
                  setSelectedColor(null);
                  setPriceRange([0, 20000]);
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          <img src="./Maryqueen.png" className="Maryqueen" alt="filter" />
        </div>

        <div className="products-container">
          {displayedProducts.length === 0 ? (
            <div className="no-products">
              <h1>No matching products found.</h1>
              <p>Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {displayedProducts?.map((item) => (
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Link to={`/products/${item.id}`} className="product-link">
                      <Specialdealscard
                        product={item}
                        id={item.id}
                        wishlistItemIds={wishlistItemIds}
                        handleWishlist={handleWishlist}
                      />
                    </Link>
                  </Col>
                ))}
              </Row>
              <div
                className="pagination"
                style={{
                  display: "flex",
                  justifyContent: "end",
                  margin: "20px 0",
                }}
              >
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={pagination.count}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {/* <Specialdealscard /> */}
    </div>
  );
};

export default Productpagebody;
