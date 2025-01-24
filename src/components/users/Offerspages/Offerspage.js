import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSareeById,
  fetchProducts,
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

const Offerspage = () => {
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [priceExpanded, setPriceExpanded] = useState(false);
  const [Filters, setFilters] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColors, setModalColors] = useState([]);
  const [colorExpanded, setColorExpanded] = useState(false);
  const [hoveredColor, setHoveredColor] = useState(null);
  const [filter, setFilter] = useState(false);
  const [isFilter, setIsFilter] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [offerTypes, setOfferTypes] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSarees());
    dispatch(fetchOfferProducts());
  }, [dispatch]);

  const { offersproducts, offersloading, offerserror } = useSelector(
    (store) => store.products
  );

  useEffect(() => {
    if (offersproducts && Array.isArray(offersproducts)) {
      const offertypes = offersproducts.map((product) => ({
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
  }, [offersproducts]);

  console.log("offerTypes", offerTypes);

  console.log("offersproducts", offersproducts);
  const { apiurl } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

    useEffect(() => {
        window.scrollTo(10, 10); 
      }, [currentPage]);

  const handleColorClick = (colorHex) => {
    setSelectedColor((prevColor) => (prevColor === colorHex ? null : colorHex)); // Toggle the selected color
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    // handleFilters();
  };

  // useEffect(() => {
  //   if (selectedColor != null) {
  //     handleFilters();
  //   }
  // }, [selectedColor]);

  const handleCheckboxChange = (name) => {
    console.log("printttttttttttttttttttttttttttttttt ", name);

    setSelectedOffers((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((offer) => offer !== name)
        : [...prevSelected, name]
    );
  };

  // useEffect(() => {
  //   if (!(selectedOffers?.length <= 0)) {
  //     handleFilters();
  //   }
  // }, [selectedOffers]);

  useEffect(() => {
    console.log("selectedOffers running ", selectedOffers);
    console.log("Selected filters:", priceRange, selectedColor);
    console.log("Filtering based on product_colors -> price and color.name");
    console.log("selected offer types ", selectedOffers);

    if (
      selectedOffers.length === 0 &&
      !selectedColor &&
      priceRange[0] === 0 &&
      priceRange[1] === 0
    ) {
      setFilteredProducts(offersproducts);
      setFilter(false);
      setCurrentPage(1);
      return;
    }

    const filtered = offersproducts.filter((product) => {
      const offerMatch =
        selectedOffers?.length > 0
          ? selectedOffers.includes(product.offer_type)
          : true;

      const colorPriceMatch = product.product_colors?.some((colorObj) => {
        const colorMatch = selectedColor
          ? colorObj.color.hexcode === selectedColor
          : true;
        const priceMatch =
          colorObj.price >= priceRange[0] && colorObj.price <= priceRange[1];

        return colorMatch && priceMatch;
      });

      return offerMatch && colorPriceMatch;
    });

    setFilteredProducts(filtered);
    setFilter(true);
    setCurrentPage(1);
  }, [offersproducts, selectedOffers, selectedColor, priceRange]);

  const totalProducts = filter
    ? filteredProducts.length
    : offersproducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const displayedProducts = (filter ? filteredProducts : offersproducts)?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  console.log("Total Products:", totalProducts);
  console.log("Total Pages:", totalPages);

  const productColors = offersproducts.map((product) => {
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

console.log("offerTypes",offerTypes)

  return (
    <div className="products-page" style={{ position: "relative" }}>
      {/* Loading Spinner covering the whole page */}
      {offersloading && (
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
              <b></b>
              <img
                src="./filter.png"
                style={{ cursor: "pointer" }}
                alt="filter-icon"
              />
            </div>
            <div className="price-div">
              <b>
                <h5>Types</h5>
              </b>
            </div>

            <div className="price-content">
              {offerTypes.map((obj, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center", // Vertically center the checkbox and text
                    marginBottom: "10px", // Add some space between the items
                    flexWrap: "wrap", // Allow the text to wrap if it's too long
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center", // Ensure label and checkbox are aligned horizontally
                      cursor: "pointer", // Make the label clickable
                      fontSize: "0.9rem", // Font size for the label text
                      paddingLeft: "0px", // Add some spacing between the checkbox and text
                      wordWrap: "break-word", // Ensure text wraps if it overflows
                      maxWidth: "200px", // Optional: Set a max width for wrapping
                    }}
                  >
                    <input
                      type="checkbox"
                      value={obj.name}
                      checked={selectedOffers.includes(obj.name)}
                      onChange={() => handleCheckboxChange(obj.name)}
                      style={{
                        marginRight: "8px", // Add some space between checkbox and label text
                        cursor: "pointer", // Change cursor to pointer to indicate clickability
                      }}
                    />
                    {obj.name}
                  </label>
                </div>
              ))}
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
              const firstColorQuantity =
                product.product_colors?.[0]?.stock_quantity;
                const otherColorsExist =
                product.product_colors?.length > 1 ? true : false;
              return (
                <>
                  <Card
                    className="product-item"
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
      {/* <Specialdealscard /> */}
    </div>
  );
};

export default Offerspage;
