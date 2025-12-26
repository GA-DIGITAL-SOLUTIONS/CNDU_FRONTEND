import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Layout, Checkbox, Input, Pagination } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import Main from "./AdminLayout/AdminLayout";
import "./Inventory.css";
import Loader from "../Loader/Loader";

const { Content } = Layout;
const { Search } = Input;

const Inventory = () => {
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();

  /* =========================
     URL = SOURCE OF TRUTH
  ========================= */
  const currentPage = Number(searchParams.get("page")) || 1;
  const cats = searchParams.get("cat") || "";
  const subcats = searchParams.get("subcat") || "";
  const search = searchParams.get("search") || "";

  /* =========================
     UI STATE (ONLY UI)
  ========================= */
  const [products, setProducts] = useState([]);
  const [totalProsCount, setTotalProsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [openSubCat, setOpenSubCat] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [pageSize, setPageSize] = useState(10);

  /* =========================
     SAFE URL UPDATER
  ========================= */
  const updateSearchParams = (updates) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    setSearchParams(params);
  };

  /* =========================
     URL → UI STATE
  ========================= */
  useEffect(() => {
    const catArr = cats ? cats.split(",") : [];
    const subArr = subcats ? subcats.split(",") : [];

    setFilteredCategories(catArr);
    setFilteredSubCategories(subArr);
    setSearchInput(search);

    if (catArr.includes("Dresses")) setOpenSubCat("Dresses");
    else if (catArr.includes("Offers")) setOpenSubCat("Offers");
    else setOpenSubCat(null);
  }, [cats, subcats, search]);

  /* =========================
     FETCH (URL ONLY)
  ========================= */
  useEffect(() => {
    setLoading(true);

    fetch(
      `${apiurl}/admin-products/?page=${currentPage}&search=${encodeURIComponent(
        search
      )}&cat=${cats}&subcat=${subcats}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.results || []);
        setTotalProsCount(data.count || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [apiurl, access_token, currentPage, cats, subcats, search]);

  /* =========================
     HANDLERS (URL ONLY)
  ========================= */
  const handleFilterChange = (checkedValues) => {
    let sub = "";

    if (checkedValues.includes("Dresses")) {
      sub = "reference_dresses,new_arrivals";
      setOpenSubCat("Dresses");
    } else if (checkedValues.includes("Offers")) {
      sub = "last_pieces,miss_prints,weaving_mistakes,negligible_damages";
      setOpenSubCat("Offers");
    } else {
      setOpenSubCat(null);
    }

    const params = new URLSearchParams(searchParams);

    params.set("cat", checkedValues.join(","));
    params.set("subcat", sub);
    params.delete("page"); // 🔥 force reset to page 1
    setSearchParams(params);
    
  };

  const handleSubFilterChange = (checkedValues) => {
    updateSearchParams({
      subcat: checkedValues.join(","),
      page: 1,
    });
  };

  const handleSearch = (value) => {
    updateSearchParams({
      search: value,
      page: 1,
    });
  };

  const handlePageChange = (page, size) => {
    updateSearchParams({ page });
    setPageSize(size);
  };

  /* =========================
     UI (UNCHANGED)
  ========================= */
  if (loading) {
    return (
      <Main>
        <Loader />
      </Main>
    );
  }

  if (error) return <p>Error fetching products</p>;

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

          {openSubCat && <h3 style={{ marginTop: "10px" }}>SubCategories</h3>}

          {openSubCat === "Dresses" && (
            <Checkbox.Group
              onChange={handleSubFilterChange}
              value={filteredSubCategories}
            >
              <div className="dress-types">
                {dressesTypes.map((d) => (
                  <div key={d.value}>
                    <Checkbox value={d.value}>{d.label}</Checkbox>
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
                {offersTypes.map((o) => (
                  <div key={o.value}>
                    <Checkbox value={o.value}>{o.label}</Checkbox>
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
              onSearch={handleSearch}
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              enterButton
              className="inventory-search-bar"
            />
          </div>

          {/* 🔥 ORIGINAL PRODUCT CARD UI – UNTOUCHED */}
          <div className="inventory-grid">
            {products.map((product) => {
              const primaryImage =
                product.product_colors?.find(
                  (colorObj) => colorObj.images.length > 0
                )?.images[0]?.image || product.image;

              return (
                <div key={product.id} className="inventory-card">
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
                            .map((colorObj) => (
                              <li
                                key={colorObj.color.id}
                                className="inventory-color-item"
                              >
                                <strong>{colorObj.color.name}</strong> - Stock:{" "}
                                {colorObj.stock_quantity},{" "}
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
                            ))}

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
