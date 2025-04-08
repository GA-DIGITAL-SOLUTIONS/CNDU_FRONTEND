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
  const [ageRange, setAgeRange] = useState([1, 25]);

  const [selectedColor, setSelectedColor] = useState(null);
  const [priceExpanded, setPriceExpanded] = useState(false);
  const [Filters, setFilters] = useState(false);
  const [colorExpanded, setColorExpanded] = useState(false);
  const [filter, setFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [Dresses, SetDresses] = useState([]);
  const [wishlistItemIds, SetWishlistItemIds] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDressProducts());
    fetchWishlistItemIds();
  }, [dispatch]);

  const { dresses, dressloading, dresserror } = useSelector(
    (store) => store.products
  );

  const { apiurl, access_token } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    const pros = dresses.filter((product) => {
      return product.is_active;
    });

    SetDresses(pros);
  }, [dresses]);

  const [dressesTypes, setDressesTypes] = useState(null);
  const [selectedOffers, setSelectedOffers] = useState([]);

  useEffect(() => {
    if (Dresses && Array.isArray(Dresses)) {
      const dressestypes = Dresses.map((product) => ({
        name: product.dress_type,
      }));
      setDressesTypes(
        dressestypes
          .filter((obj) => obj.name)
          .filter(
            (obj, index, self) =>
              self.findIndex((o) => o.name === obj.name) === index
          )
      );
    }
  }, [Dresses]);

  console.log("dressesTypes", dressesTypes);

  useEffect(() => {
    window.scrollTo(10, 10);
  }, [currentPage]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };
	
  const handleAgeChange = (value) => {
		console.log("value", value);
		
    setAgeRange(value);
  };
	
	useEffect(()=>{
		handleFilters();
	},[ageRange])
	
	useEffect(()=>{
		handleFilters();
	},[priceRange])

	console.log("value changes  ",ageRange)

  const handleColorClick = (color) => {
    console.log("color", color);
    if (selectedColor == color) {
      setFilter(false);
      setSelectedColor(null);
    } else {
      setSelectedColor(color);
    }
  };

  useEffect(() => {
    if (selectedColor != null) {
      handleFilters();
    }
  }, [selectedColor]);

  const togglePrice = () => {
    setPriceExpanded(!priceExpanded);
  };

  const togglefilters = () => {
    setFilters(!Filters);
		if(!Filters){
			setAgeRange([0,25])
			setPriceRange([0,20000])
		}
  };

  const toggleColor = () => {
    setColorExpanded(!colorExpanded);
  };

  // const handleFilters = () => {
  // 	const filtered = Dresses.filter((product) => {
  // 		const colorPriceMatch = product.product_colors?.some((colorObj) => {
  // 			const colorMatch = selectedColor
  // 				? colorObj.color.hexcode === selectedColor
  // 				: true;
  // 			const priceMatch =
  // 				colorObj.price >= priceRange[0] && colorObj.price <= priceRange[1];

  // 			return colorMatch && priceMatch;
  // 		});

  // 		return colorPriceMatch;
  // 	});

  // 	console.log("Filtered Products:", filtered);
  // 	setFilteredProducts(filtered);
  // 	setFilter(true);
  // 	setCurrentPage(1);
  // };

  useEffect(() => {
    if (!Filters) {
      setFilteredProducts(Dresses);
    }
  }, [Filters, Dresses]);

  const handleFilters = () => {
    const filtered = Dresses.filter((product) => {
      const colorPriceMatch = product.product_colors?.some((colorObj) => {
        const colorMatch = selectedColor
          ? colorObj.color.hexcode === selectedColor
          : true;
        const priceMatch =
          colorObj.price >= priceRange[0] && colorObj.price <= priceRange[1];

        // Extract the numeric part from the size string
        const ageValue = parseInt(colorObj?.size, 10);
        console.log("ageValue", ageValue);
				console.log("valueeeeees are ",ageRange)

        const ageMatch =
          !isNaN(ageValue) &&
          ageValue >= ageRange[0] &&
          ageValue <= ageRange[1];
        return colorMatch && priceMatch && ageMatch;
      });

      const offerMatch =
        selectedOffers.length > 0
          ? selectedOffers.includes(product.dress_type)
          : true;

      return colorPriceMatch && offerMatch;
    });

    console.log("Filtered Products:", filtered);
    setFilteredProducts(filtered);
    setFilter(true);
    setCurrentPage(1);
  };

  const totalProducts = filter ? filteredProducts.length : Dresses.length;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const displayedProducts = (filter ? filteredProducts : Dresses)?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [activeKey, setActiveKey] = useState(["1"]);

  const productColors = Dresses.map((product) => {
    return product.product_colors;
  });

  const allColors = productColors.flatMap((Pcobj) =>
    Pcobj.map((singlcolor) => singlcolor.color)
  );

  const uniqueColors = allColors.filter(
    (color, idx, self) =>
      self.findIndex((c) => c.hexcode === color.hexcode) === idx
  );

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

  const handleCheckboxChange = (name) => {
    setSelectedOffers((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((offer) => offer !== name)
        : [...prevSelected, name]
    );
  };

  // Use useEffect to call handleFilters whenever selectedOffers changes

  useEffect(() => {
    handleFilters();
  }, [selectedOffers]);

  console.log("filtered products", filteredProducts);

  return (
    <div className="products-page" style={{ position: "relative" }}>
      {}
      {dressloading && (
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
                <h5>Age</h5>
              </b>
            </div>

            {Filters && (
              <div className="price-content">
                <Slider
                  className="custom-slider"
                  range
                  min={1}
                  max={25}
                  step={1}
                  trackStyle={{
                    borderColor: "#000",
                    backgroundColor: "#fff",
                  }}
                  value={ageRange}
                  onChange={handleAgeChange}
                />
                <p>
								Age Range: {ageRange[0]} yrs - {ageRange[1]} yrs
                </p>
              </div>
            )}

            <div className="price-div">
              <b>
                <h5>Types</h5>
              </b>
            </div>

            {Filters && (
              <div className="price-content">
                {dressesTypes.map((obj, index) => (
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
                        // checked={selectedOffers.includes(obj.name)}
                        onChange={() => handleCheckboxChange(obj.name)}
                        style={{
                          marginRight: "8px",
                          cursor: "pointer",
                        }}
                      />
                      {obj.name == "new_arrivals"
                        ? "New Arrivals"
                        : obj.name == "reference_dresses"
                        ? "Reference Dresses"
                        : ""}
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
                      width: selectedColor === color?.hexcode ? "45px" : "40px",
                      height:
                        selectedColor === color?.hexcode ? "45px" : "40px",
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
              const isWishlisted = Boolean(wishlistedItem);

              const pre_book_eligible = firstcolorobjj?.pre_book_eligible;
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
                            <Link
                              to={`/dresses/${product.id}`}
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
                                    <div>Pre Booking Available</div>
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
                                    display: "flex",
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
      {}
    </div>
  );
};

export default Dresses;
