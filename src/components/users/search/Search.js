import React, { useEffect, useState } from "react";
import { Slider, Card, Row, Col, Button, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchCollections, fetchProducts } from "../../../store/productsSlice";
import Specialdealscard from "../cards/Specialdealscard";
import { searchProducts } from "../../../store/searchSlice";
import Header from "../Header/Header";
import "./Search.css";
import Heading from "../Heading/Heading";
import { fetchFabrics } from "../../../store/productsSlice";
import productpageBanner from "./images/productpageBanner.png";
import uparrow from "./images/uparrow.svg";
import filtericon from "./images/filter.png";
import Maryqueen from "./images/Maryqueen.png";

const SeachComponent = () => {
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [Filters, setFilters] = useState(false);

  const [filter, setFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [SearchedResults, SetSearchedResults] = useState([]);


  const { searchResults } = useSelector((state) => state.search);


     useEffect(() => {
          const pros = searchResults.filter((product) => {
            return product.is_active; // Only include products where is_active is true
          });
        
          SetSearchedResults(pros); // Set the filtered products to state
        }, [searchResults]);
    
  // console.log("searchProducts", SearchedResults);
  const { searchterm } = useParams();
  // console.log("searchterm", searchterm);
  const { Meta } = Card;
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  useEffect(() => {
    // console.log("running 1 2");
    const query = searchterm;
    dispatch(searchProducts({ apiurl, access_token, query }));
  }, [searchterm]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
    handleFilters();
  };

  const handleColorClick = (color) => {
    // console.log("selected color ", color);
    setSelectedColor(color);
  };
  useEffect(() => {
    if (selectedColor != null) {
      handleFilters();
    }
  }, [selectedColor]);

  const togglefilters = () => {
    setFilters(!Filters);
  };

  const handleFilters = () => {
    const filtered = SearchedResults.filter((product) => {
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

  const totalProducts = filter ? filteredProducts.length : SearchedResults.length;

  const displayedProducts = (filter ? filteredProducts : SearchedResults)?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const productColors = SearchedResults.map((product) => {
    return product.product_colors;
  });

  const allColors = productColors.flatMap((Pcobj) =>
    Pcobj.map((singlcolor) => singlcolor.color)
  );

  const uniqueColors = allColors.filter(
    (color, idx, self) =>
      self.findIndex((c) => c.hexcode === color.hexcode) === idx
  );

  return (
    <div className="products-page">
      <img
        src={productpageBanner}
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
                src={filtericon}
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
          <img src={Maryqueen} className="Maryqueen" alt="filter-cndu"></img>
        </div>

        <div className="products-container">
          <h4>
            <Heading>Search Result</Heading>
          </h4>
          <div className="products-main-cont">
            {displayedProducts?.map((product) => {
              const firstColorImage =
                product.product_colors?.[0]?.images?.[0]?.image ||
                product.image;
              const firstPrice = product.product_colors?.[0]?.price;
              const firstColorQuantity=product.product_colors?.[0]?.stock_quantity;
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
                                <div style={{color:" #28a745"}}>Check Other Colors</div>
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
    </div>
  );
};

export default SeachComponent;
