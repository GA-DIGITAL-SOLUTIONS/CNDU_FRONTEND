import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/productsSlice";
import { Layout, Checkbox, Spin, Input, Pagination } from "antd";

import { Link } from "react-router-dom";
import Main from "./AdminLayout/AdminLayout";
import "./Inventory.css";
import Loader from "../Loader/Loader";

const { Content } = Layout;
const { Search } = Input;

const Inventory = () => {
  const dispatch = useDispatch();
  const { products, productsloading, error } = useSelector(
    (state) => state.products
  );
  const { apiurl } = useSelector((state) => state.auth);

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    let updatedProducts = products;

    if (filteredCategories.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        filteredCategories.includes(product.category?.id)
      );
    }

    if (searchQuery.trim()) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(updatedProducts);
  }, [products, filteredCategories, searchQuery]);

  const handleFilterChange = (checkedValues) => {
    setFilteredCategories(checkedValues);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const uniqueCategories = [
    ...new Map(
      products.map((product) => [product.category?.id, product.category])
    ).values(),
  ].filter((category) => category);

  if (productsloading) {
    return (
      <Main>
        <Loader />
      </Main>
    );
  }

  if (error) return <p>Error fetching products: {error}</p>;

  return (
    <Main>
      <Content className="inventory-container">
        <div className="inventory-filters">
          <h3>Filter by Category</h3>
          <Checkbox.Group
            onChange={handleFilterChange}
            className="inventory-filter-checkboxes"
          >
            {uniqueCategories.map((category) => (
              <div key={category.id}>
                <Checkbox value={category.id}>{category.name}</Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        </div>

        <div className="inventory-content">
          <div className="inventory-search">
            <Search
              placeholder="Search products..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              value={searchQuery}
              enterButton
              className="inventory-search-bar"
            />
          </div>

          <div className="inventory-grid">
            {paginatedProducts.map((product) => {
              const primaryImage =
                product.product_colors?.find(
                  (colorObj) => colorObj.images.length > 0
                )?.images[0]?.image || product.image;

              return (
                <div key={product.id} className="inventory-card">
                  <Link to={`/inventory/product/${product.id}`}>
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
                                {colorObj.stock_quantity}, ₹{colorObj.price}
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

          {}
          {filteredProducts.length > pageSize && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProducts.length}
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
