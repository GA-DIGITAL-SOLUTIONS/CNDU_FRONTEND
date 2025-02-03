import React, { useEffect, useState } from "react";
import { Slider, Card, Row, Col, Button, Pagination, Model } from "antd";
import "./Productpagebody.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchSarees } from "../../../../store/productsSlice";
import Specialdealscard from "../../cards/Specialdealscard";
import { Link } from "react-router-dom";
import Heading from "../../Heading/Heading";
import Loader from "../../../Loader/Loader";

const { Meta } = Card;

const Productpagebody = () => {
  
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

  const [Products,SetProducts] =useState([]);
  

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSarees());
    dispatch(fetchProducts());
  }, [dispatch]);

  const { sarees, sareesloading, sareeserror } = useSelector(
    (store) => store.products
  );
  const { apiurl } = useSelector((state) => state.auth);

  console.log("F", sarees, "products");

  useEffect(() => {
    const pros = sarees.filter((product) => {
      return product.is_active;
    });
    SetProducts(pros); 
  }, [sarees]);

  
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
    console.log("selected color ", color);
    setSelectedColor((prevColor) => (prevColor === color ? null : color));
  };
  

  useEffect(() => {
    console.log("selectedColor", selectedColor);
    if (selectedColor != null) {
      handleFilters();
    }else{
      // handleFilters();
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

    const filtered = Products?.filter((product) => {
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

  const totalProducts = filter ? filteredProducts.length : Products.length;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const displayedProducts = (filter ? filteredProducts : Products)?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  console.log("Total Products:", totalProducts);
  console.log("Total Pages:", totalPages);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [activeKey, setActiveKey] = useState(["1"]);

  const productColors = Products.map((product) => {
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
      {sareesloading && (
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
              const firstColorQuantity=product.product_colors?.[0]?.stock_quantity
              const otherColorsExist =
                product.product_colors?.length > 1 ? true : false;
              return (
                <>
                  <Card
                    className="product-item"
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
                          }}
                        />
                      </Link>
                    }
                  >
                    <div className="product-info">
                      <Meta
                        title={
                          <Link
                            to={`/products/${product.id}`}
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
      {/* <Specialdealscard /> */}
    </div>
  );
};

export default Productpagebody;
