import React, { useEffect, useState } from "react";
import { Slider, Card, Row, Col, Button, Pagination } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import "./Productpagebody.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../../store/productsSlice";
import Specialdealscard from "../../cards/Specialdealscard";
import { Link } from "react-router-dom";
import Heading from "../../Heading/Heading";

const { Meta } = Card;

const Productpagebody = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [priceExpanded, setPriceExpanded] = useState(false);
  const [colorExpanded, setColorExpanded] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // Number of products per page

  const dispatch = useDispatch();

  // Fetch products from Redux store
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const { products, loading, error } = useSelector((store) => store.products);
  const { apiurl } = useSelector((state) => state.auth); // Dynamically use apiurl for image paths

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Slice products based on current page
  const displayedProducts = products?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePriceChange = (value) => {
    setPriceRange(value);
    console.log("Selected Price Range:", value);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    console.log("Selected Color:", color);
  };

  const togglePrice = () => {
    setPriceExpanded(!priceExpanded);
  };

  const toggleColor = () => {
    setColorExpanded(!colorExpanded);
  };

  return (
    <div className="products-page-body">
      <img
        src="./productpageBanner.png"
        className="productpageBanner"
        alt="Product Page Banner"
      />
      <div className="filter-products-container">
        {/* Filter Section */}
        <div className="filter-container">
          {/* <h3></h3> */}
          <Heading>Filter</Heading>

          <div className="filter">
            <div className="first-div">
              <b>
                <h5>Filter Options</h5>
              </b>
              <img src="./filter.png" alt="filter-icon" />
            </div>

            {/* Price Section */}
            <div className="price-div">
              <b>
                <h5>Price</h5>
              </b>
              <img
                className="uparrow"
                src="./uparrow.svg"
                alt="price-toggle"
                onClick={togglePrice}
                style={{ cursor: "pointer" }}
              />
            </div>

            {priceExpanded && (
              <div className="price-content">
                <Slider
                  className="custom-slider"
                  range
                  min={0}
                  max={2000}
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
              <img
                className="uparrow"
                src="./uparrow.svg"
                alt="color-toggle"
                onClick={toggleColor}
                style={{ cursor: "pointer" }}
              />
            </div>

            {/* Color Options Expanded Content */}
            {colorExpanded && (
              <div className="color-content">
                {["Red", "Blue", "Green", "Black", "White"].map((color) => (
                  <div
                    key={color}
                    className="color-box"
                    style={{
                      backgroundColor: color.toLowerCase(),
                      border:
                        selectedColor === color
                          ? "2px solid black"
                          : "1px solid #ddd",
                      width: "40px",
                      height: "40px",
                      borderRadius: "30px",
                    }}
                    onClick={() => handleColorClick(color)}
                  ></div>
                ))}
              </div>
            )}
          </div>
          <img src="./Maryqueen.png" className="Maryqueen"></img>
        </div>

        {/* Products Section */}
        <div className="products-container">
          <h1
            style={{
              textAlign: "center",
            }}
          >
            Products
          </h1>

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

export default Productpagebody;
