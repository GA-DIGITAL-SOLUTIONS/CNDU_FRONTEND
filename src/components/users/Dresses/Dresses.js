
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
fetchDressProducts,
  fetchOfferProducts,
  fetchSarees,
} from "../../../store/productsSlice";
import productpageBanner from "./productpageBanner.png";

import { Link } from "react-router-dom";
import { Breadcrumb, Rate, Button, InputNumber, Spin, Slider } from "antd";
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

import FetchCostEstimates from "../cards/Estimations";
import Loader from "../../Loader/Loader";

const { Meta } = Card;

const Dresses = () => {
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [priceExpanded, setPriceExpanded] = useState(false);
  const [Filters, setFilters] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColors, setModalColors] = useState([]);
  const [colorExpanded, setColorExpanded] = useState(false);
  const [hoveredColor, setHoveredColor] = useState(null);
  const [filter, setFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDressProducts());
  }, [dispatch]);

  const { dresses, dressloading, dresserror } = useSelector(
    (store) => store.products
  );

  console.log("offersproducts",dresses)
  const { apiurl } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const handlePriceChange = (value) => {
    setPriceRange(value);
    handleFilters();
  };

  const handleColorClick = (color) => {
    console.log("selected color ", color);
    setSelectedColor(color);
  };
  useEffect(() => {
    console.log("selectedColor", selectedColor);
    if (selectedColor != null) {
      handleFilters();
    }
  }, [selectedColor]);

  console.log("filter", filter);

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
    console.log("Selected filters:", priceRange, selectedColor);
    console.log("Filtering based on product_colors -> price and color.name");

    const filtered = dresses.filter((product) => {
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

    console.log("Filtered Products:", filtered);
    setFilteredProducts(filtered);
    setFilter(true);
    setCurrentPage(1);
  };

  const totalProducts = filter ? filteredProducts.length : dresses.length;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const displayedProducts = (filter ? filteredProducts : dresses)?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  console.log("Total Products:", totalProducts);
  console.log("Total Pages:", totalPages);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [activeKey, setActiveKey] = useState(["1"]);

  const productColors = dresses.map((product) => {
    return product.product_colors;
  });
  console.log("productColors", productColors);

  const allColors = productColors.flatMap((Pcobj) =>
    Pcobj.map((singlcolor) => singlcolor.color)
  );

  const uniqueColors = allColors.filter(
    (color, idx, self) =>
      self.findIndex((c) => c.hexcode === color.hexcode) === idx
  );

  console.log("hoveredColor", hoveredColor);
  return (
    <div className="products-page" style={{ position: "relative" }}>
      {/* Loading Spinner covering the whole page */}
      {dressloading && (
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
                src="./filter.png"
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

            {true && (
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

            {true && (
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
              return (
                <>
                  <Card
                    className="product-item"
                    cover={
                      <Link to={`/dresses/${product.id}`}>
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
                      </Link>
                    }
                  >
                    <div className="product-info">
                      <Meta
                        title={
                          <Link to={`/dresses/${product.id}`}
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
      {/* <Specialdealscard />   */}
    </div>
  );
}

export default Dresses