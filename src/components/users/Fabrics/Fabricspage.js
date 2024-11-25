import React, { useEffect, useState } from "react";
import { Slider, Card, Row, Col, Button, Pagination ,Collapse} from "antd";
import { DollarOutlined } from "@ant-design/icons";
import "./Fabricspage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../store/productsSlice";
import Specialdealscard from "../cards/Specialdealscard";
import Heading from "../Heading/Heading";

import { Link } from "react-router-dom";

const { Meta } = Card;


const Fabricspage = () => {
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [priceExpanded, setPriceExpanded] = useState(false);
  const [colorExpanded, setColorExpanded] = useState(false);
  
  const [filter, setFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const dispatch = useDispatch();
  
  // Fetch products from Redux store
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  const { products, loading, error } = useSelector((store) => store.products);
  const { apiurl } = useSelector((state) => state.auth); // Dynamically use apiurl for image paths
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // Number of products per page
  
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
  
  const handleFilters = () => {
    console.log("Selected filters:", priceRange, selectedColor);
    console.log("Filtering based on product_colors -> price and color.name");
  
    const filtered = products.filter((product) => {
      // Check if any product_colors match the selected color and price range
      const colorPriceMatch = product.product_colors?.some((colorObj) => {
        const colorMatch = selectedColor
          ? colorObj.color.name.toLowerCase() === selectedColor.toLowerCase()
          : true;
        const priceMatch =
          colorObj.price >= priceRange[0] && colorObj.price <= priceRange[1];
  
        return colorMatch && priceMatch;
      });
  
      return colorPriceMatch; // Keep product if at least one product_color matches
    });
  
    console.log("Filtered Products:", filtered);
    setFilteredProducts(filtered);
    setFilter(true); // Set filter state to true
    setCurrentPage(1); // Reset to first page when filters are applied
  };
  
  // Calculate total products and total pages
  const totalProducts = filter ? filteredProducts.length : products.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  
  // Pagination: Show either filtered or all products based on the filter state
  const displayedProducts = (filter ? filteredProducts : products)?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  console.log("Total Products:", totalProducts);
  console.log("Total Pages:", totalPages);
  
  

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const textArray = [
    "A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.",
    "Cats are small, carnivorous mammals that are often valued by humans for companionship and their ability to hunt vermin.",
    "Birds are a group of warm-blooded vertebrates constituting the class Aves, characterized by feathers, toothless beaked jaws, and laying hard-shelled eggs.",
  ];

  const [activeKey, setActiveKey] = useState(["1"]);

  const handleCollapseChange = (key) => {
    setActiveKey(key);
  };
  const isExpanded = activeKey.includes("1");

  const items = [
    {
      key: "1",
      label: "",
      children: (
        <div>
          {isExpanded && (
            <div className="price-content">
              <Slider
                className="custom-slider"
                range
                min={0}
                max={2000000}
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
        </div>
      ),
    },
    {
      key: "2",
      label: "This is panel header 2",
      children: (
        <p style={{ paddingInlineStart: 24 }}>
          Cats are small, carnivorous mammals...
        </p>
      ),
    },
    {
      key: "3",
      label: "This is panel header 3",
      children: (
        <p style={{ paddingInlineStart: 24 }}>
          Birds are warm-blooded vertebrates...
        </p>
      ),
    },
  ];

  const productColors = products.map((product) => {
    return product.product_colors;
  });
  console.log("productColors", productColors);

  const allColors = productColors.flatMap((Pcobj) =>
    Pcobj.map((singlcolor) => singlcolor.color)
  );

  // Deduplicate the combined array by color name (case-insensitive)
  const uniqueColors = allColors.filter(
    (color, idx, self) =>
      self.findIndex(
        (c) => c.name.toLowerCase() === color.name.toLowerCase()
      ) === idx
  );

  console.log("All Colors:", allColors); // Debugging all combined colors
  console.log("Unique Colors:", uniqueColors); // Debugging deduplicated colors

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
          <Button
            type="primary"
            style={{
              backgroundColor: "#F24C88",
              color: "white",
              marginBottom: "2px",
            }}
            onClick={handleFilters}
          >
            Add Filters
          </Button>
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
                  max={2000000}
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

            {/* here i am adding the ant d accordian */}
            
            {/* <Collapse
              items={items}
              bordered={false}
              defaultActiveKey={["1"]}
              onChange={handleCollapseChange}
            /> */}

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
                {uniqueColors.map((color) => (
                  <div
                    key={color?.name}
                    className="color-box"
                    style={{
                      backgroundColor: color?.name.toLowerCase(), // Dynamic color
                      border:
                        selectedColor === color?.name
                          ? "2px solid pink" // Highlight selected color
                          : "1px solid #ddd",
                      width: "40px", // Dimensions for color box
                      height: "40px",
                      borderRadius: "30px", // Circular box
                      cursor: "pointer", // Pointer cursor for better UX
                    }}
                    onClick={() => handleColorClick(color?.name)} // Handle click
                  >
                    <h4
                      style={{
                        color: "#fff",
                        fontSize: "10px",
                        textAlign: "center",
                      }}
                    >
                      {color.name.toLowerCase()}
                    </h4>
                  </div>
                ))}
              </div>
            )}
          </div>
          <img src="./Maryqueen.png" className="Maryqueen"></img>
        </div>

        {/* Products Section */}
        <div className="products-container">
          
          <h3><Heading>Fabrics</Heading></h3>  
        

          <Row gutter={[14, 14]}>
            {/* Check if products are loaded and display them */}
            {displayedProducts?.map((product) => {
              const firstColorImage =
                product.product_colors?.[0]?.images?.[0]?.image ||
                product.image; // here first color image
              const firstPrice = product.product_colors?.[0]?.price; // first color
              return (
                <Col span={6} key={product.id}>
                  <Card
                    cover={
                      <Link to={`/fabrics/${product.id}`}>
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
                          to={`/fabrics/${product.id}`}
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            {product.name}
                          </Link>
                        }
                        description="In stock"
                      />
                      <Button
                        type="primary"
                        // icon={<DollarOutlined />}
                        style={{
                          width: "45%",
                          backgroundColor: "#F6F6F6",
                          color: "#3C4242",
                        }}
                      >
                        Rs: {firstPrice}
                      </Button>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Pagination */}
          <Pagination
            current={currentPage}
            total={totalProducts}
            pageSize={pageSize}
            onChange={(page)=>setCurrentPage(page)}
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

export default Fabricspage;
