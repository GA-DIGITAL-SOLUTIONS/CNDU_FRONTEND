

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/productsSlice";
import { Layout, Checkbox, Input, Pagination } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Main from "./AdminLayout/AdminLayout";
import "./Inventory.css";
import Loader from "../Loader/Loader";

const { Content } = Layout;
const { Search } = Input;

const Inventory = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { apiurl, access_token } = useSelector((state) => state.auth);

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  // const [searchQuery, setSearchQuery] = useState("");

  const [searchInput, setSearchInput] = useState(""); // Input field value
  const [searchQuery, setSearchQuery] = useState(""); // Triggers backend fe
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(false);
  const [totalProsCount, SetTotalProsCount] = useState(0);
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const [products, setProducts] = useState([]);
  const [selectedDressTypes, setSelectedDressTypes] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState(null);
  const [openSubCat, setOpenSubCat] = useState(null);
  const [selectedCategory, SetSelectedCategory] = useState(null);
  const [selectedSubCategory, SetSelectedSubCategory] = useState(null);

  const navigate = useNavigate();

  // useEffect(() => {
  //   // dispatch(fetchProducts());
  // }, [dispatch,searchQuery]);

  // Sync filters with URL params
  useEffect(() => {
    const params = new URLSearchParams();

    if (filteredCategories.length)
      params.set("cat", filteredCategories.join(","));
    if (filteredSubCategories?.length)
      params.set("subcat", filteredSubCategories.join(","));
    if (searchQuery) params.set("search", searchQuery);
    params.set("page", currentPage);

    setSearchParams(params);
  }, [filteredCategories, filteredSubCategories, searchQuery, currentPage]);

  useEffect(() => {
    fetchPaginatedProducts();
    // console.log("filteredCategories")
  }, [currentPage, searchQuery, filteredCategories, filteredSubCategories]);

  // Restore filters from URL when component mounts
  useEffect(() => {
    const cats = searchParams.get("cat")?.split(",").filter(Boolean) || [];
    const subcats =
      searchParams.get("subcat")?.split(",").filter(Boolean) || [];
    const search = searchParams.get("search") || "";

    setFilteredCategories(cats);
    setFilteredSubCategories(subcats);
    setSearchQuery(search);
    setSearchInput(search);

    // To show subcategory section automatically when coming back
    if (cats.includes("Dresses")) setOpenSubCat("Dresses");
    else if (cats.includes("Offers")) setOpenSubCat("Offers");
  }, []); // run only once

  // useEffect(()=>{
  //   console.log("filteredCategories",filteredCategories)
  //   console.log("subfilterdCategories",filteredSubCategories)
  // },[filteredCategories])

  function fetchPaginatedProducts() {
    setLoading(true);
    const urlWithPage = `${apiurl}/admin-products/?page=${currentPage}&search=${encodeURIComponent(
      searchQuery
    )}&cat=${filteredCategories?.join(
      ","
    )}&subcat=${filteredSubCategories?.join(",")}`;
    fetch(urlWithPage, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        setProducts(data.results);
        SetTotalProsCount(data.count);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
        console.error("Error fetching paginated products:", error);
      });
  }

  // useEffect(() => {
  //   let updatedProducts = products;

  //   if (filteredCategories.length > 0) {
  //     updatedProducts = updatedProducts.filter((product) =>
  //       filteredCategories.includes(product.category?.name)
  //     );
  //   }

  //   if (filteredSubCategories?.length > 0) {
  //     updatedProducts = updatedProducts.filter((product) =>
  //       filteredSubCategories.includes(product?.dress_type)
  //     );
  //   }
  //   setFilteredProducts(updatedProducts);
  // }, [products, filteredCategories, filteredSubCategories, currentPage]);

  const handleFilterChange = (checkedValues) => {
    // setSearchQuery(null)
    // setSearchInput(null)
    console.log("checkedValues", checkedValues);
    if (checkedValues.includes("Dresses")) {
      setOpenSubCat("Dresses");
      setFilteredSubCategories(["reference_dresses", "new_arrivals"]);
    } else if (checkedValues.includes("Offers")) {
      setOpenSubCat("Offers");
      setFilteredSubCategories([
        "last_pieces",
        "miss_prints",
        "weaving_mistakes",
        "negligible_damages",
      ]);
    } else {
      setOpenSubCat(null);
      setFilteredSubCategories(null);
      // setFilteredSubCategories([]);

    }
    // navigate("/inventory");
    setFilteredCategories(checkedValues);
  };

  const handleSubFilterChange = (checkedValues) => {
    console.log("checkedValues", checkedValues);
    setFilteredSubCategories(checkedValues);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setSearchParams({ page: 1 }); // 👈 Reset to page 1 on search
  };

  const handlePageChange = (page, size) => {
    setSearchParams({ page: page });
    setPageSize(size);
  };

  // const uniqueCategories = [
  //   ...new Map(
  //     products.map((product) => [product.category?.id, product.category])
  //   ).values(),
  // ].filter((category) => category);

  // const uniqueDressTypes = [
  //   ...new Set(
  //     products
  //       .map((product) => product?.dress_type)
  //       .filter(
  //         (dressType) =>
  //           typeof dressType === "string" &&
  //           dressType.trim().toLowerCase() !== "undefined"
  //       )
  //   ),
  // ];

  if (loading) {
    return (
      <Main>
        <Loader />
      </Main>
    );
  }

  if (error) return <p>Error fetching products: {error.message}</p>;

  // const formatDressTypeName = (name) => {
  //   const DressLabels = {
  //     new_arrivals: "New Arrivals",
  //     reference_dresses: "Reference Dresses",
  //   };
  //   return DressLabels[name] || name;
  // };

  const productTypes = [
    { label: "Sarees", value: "product" },
    { label: "Fabrics", value: "fabric" },
    { label: "Dresses", value: "dress" },
    { label: "Blouses", value: "blouse" },
    { label: "Offers", value: "offers" },
  ];

  const offersTypes = [
    { label: "Last Pieces", value: "last_pieces" },
    { label: "Miss Prints", value: "miss_prints" },
    { label: "Weaving Mistakes", value: "weaving_mistakes" },
    { label: "Negligible Damages", value: "negligible_damages" },
  ];

  const dressesTypes = [
    { label: "Reference dresses", value: "reference_dresses" },
    { label: "New Arrival", value: "new_arrivals" },
  ];

  console.log("openSubCat", openSubCat);
  console.log("openSubCat", openSubCat);

  return (
    <Main>
      <Content className="inventory-container">
        <div className="inventory-filters">
          <h3> Filter by Category </h3>
          <Checkbox.Group
            onChange={handleFilterChange}
            value={filteredCategories}
            className="inventory-filter-checkboxes"
          >
            {productTypes.map((category) => (
              <div key={category.label}>
                <Checkbox value={category.label}>{category.label}</Checkbox>
              </div>
            ))}
          </Checkbox.Group>
          {openSubCat ? (
            <h3 style={{ marginTop: "10px" }}>SubCategories</h3>
          ) : (
            ""
          )}
          {openSubCat === "Dresses" && (
            <Checkbox.Group
              onChange={handleSubFilterChange}
              value={filteredSubCategories}
            >
              <div className="dress-types">
                {dressesTypes.length > 0 &&
                  dressesTypes.map((dressType) => (
                    <div span={9} key={dressType.value}>
                      <Checkbox value={dressType.value}>
                        {/* {formatDressTypeName(dressType)} */}
                        {dressType.label}
                      </Checkbox>
                    </div>
                  ))}
              </div>
            </Checkbox.Group>
          )}

          {openSubCat === "Offers" && (
            <Checkbox.Group
              onChange={handleSubFilterChange}
              value={filteredSubCategories}
            >
              <div className="dress-types">
                {offersTypes.length > 0 &&
                  offersTypes.map((dressType) => (
                    <div span={9} key={dressType.value}>
                      <Checkbox value={dressType.value}>
                        {/* {formatDressTypeName(dressType)} */}
                        {dressType.label}
                      </Checkbox>
                    </div>
                  ))}
              </div>
            </Checkbox.Group>
          )}
        </div>

        <div className="inventory-content">
          <div className="inventory-search">
            <Search
              placeholder="Search products..."
              allowClear
              onSearch={handleSearch} // triggered when pressing enter or clicking search
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              enterButton
              className="inventory-search-bar"
            />
          </div>

          <div className="inventory-grid">
            {products.map((product) => {
              const primaryImage =
                product.product_colors?.find(
                  (colorObj) => colorObj.images.length > 0
                )?.images[0]?.image || product.image;

              return (
                <div key={product.id} className="inventory-card">
                  {/* <Link to={`/inventory/product/${product.id}`}> */}

                  <Link
                    to={`/inventory/product/${
                      product.id
                    }?${searchParams.toString()}`}
                  >
                    <div className="inventory-card-content">
                      <img
                        src={`${apiurl}${primaryImage}`}
                        alt={product.name}
                        className="inventory-image"
                      />
                      <div className="inventory-details">
                        <h3 className="inventory-title">
                          {product.name.length > 20
                            ? product.name.slice(0, 20) + "..."
                            : product.name}
                        </h3>

                        <p className="inventory-category">
                          Category:{" "}
                          <span>{product.category?.name || "N/A"}</span>
                        </p>
                        <p className="inventory-category">
                          Weight: <span>{product.weight} grams</span>
                        </p>

                        <p className="inventory-colors-title">Varients</p>
                        <ul className="inventory-colors-list">
                          {product.product_colors
                            .slice(0, 2)
                            .map((colorObj) => {
                              console.log("color obj", colorObj);
                              return (
                                <li
                                  key={colorObj.color.id}
                                  className="inventory-color-item"
                                >
                                  <strong>{colorObj.color.name}</strong> -
                                  Stock: {colorObj.stock_quantity}, {" "}
                                  {colorObj.color_discounted_amount_each > 0 ? (
                                    <>
                                      <span
                                        style={{
                                          textDecoration: "line-through",
                                          color: "gray",
                                          marginRight: "8px",
                                        }}
                                      >
                                        ₹{colorObj.price}
                                      </span>
                                      <span
                                        style={{
                                          color: "green",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        ₹{colorObj.color_discounted_amount_each}
                                      </span>
                                    </>
                                  ) : (
                                    <span>₹{colorObj.price}</span>
                                  )}
                                </li>
                              );
                            })}
                          {product.product_colors.length > 2 && (
                            <li className="inventory-color-item">
                              +{product.product_colors.length - 2} more
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {products.length > 0 && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalProsCount}
              onChange={handlePageChange}
              showSizeChanger
              onShowSizeChange={handlePageChange}
              className="inventory-pagination"
            />
          )}
        </div>
      </Content>
    </Main>
  );
};

export default Inventory;
