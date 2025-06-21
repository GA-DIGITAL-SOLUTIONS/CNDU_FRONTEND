// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "../../store/productsSlice";
// import { Layout, Checkbox, Spin, Input, Pagination, Row, Col } from "antd";

// import { Link, useSearchParams } from "react-router-dom";
// import Main from "./AdminLayout/AdminLayout";
// import "./Inventory.css";
// import Loader from "../Loader/Loader";

// const { Content } = Layout;
// const { Search } = Input;

// const Inventory = () => {
//   const dispatch = useDispatch();
//   // const { products, productsloading } = useSelector((state) => state.products);
//   const [loading, setLoading] = useState(false);
//   const { apiurl, access_token } = useSelector((state) => state.auth);

//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   // const [currentPage, setCurrentPage] = useState(1);

//   const [searchParams, setSearchParams] = useSearchParams();
//   const [pageSize, setPageSize] = useState(8);
//   const [error, setError] = useState(false);

//   const [totalProsCount, SetTotalProsCount] = useState(5);

//   const currentPage = parseInt(searchParams.get("page")) || 1;

//   console.log("currentPage", currentPage);

//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   useEffect(() => {
//     fetchPaginatedProducts();
//   }, [currentPage]);

//   function fetchPaginatedProducts() {
//     setLoading(true);
//     console.log("caling ");
//     const urlWithPage = `${apiurl}/admin-products/?page=${currentPage}`;
//     console.log("urlWithPage", urlWithPage);
//     fetch(urlWithPage, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("caling 4");
//         setLoading(false);
//         setProducts(data.results)

//         console.log("Paginated Products:", data.results); // Array of products
//         console.log("Total Products:", data.count); // Total number of products
//         console.log("Next Page URL:", data.next); // For "Next" button
//         console.log("Previous Page URL:", data.previous); // For "Previous" button
//         SetTotalProsCount(data.count);
//         // You can now render these products in your UI or call a render function
//       })
//       .catch((error) => {
//         setLoading(false);
//         setError(error);
//         console.error("Error fetching paginated products:", error);
//       });
//   }

//   const [selectedDressTypes, setSelectedDressTypes] = useState([]);
//   const [filteredSubCategories, setFilteredSubCategories] = useState([]);
//   const [subCategory, setSubCategory] = useState(null);

//   useEffect(() => {
//     let updatedProducts = products;

//     if (filteredCategories.length > 0) {
//       updatedProducts = updatedProducts.filter((product) =>
//         filteredCategories.includes(product.category?.name)
//       );
//     }

//     if (filteredSubCategories?.length > 0) {
//       updatedProducts = updatedProducts.filter((product) =>
//         filteredSubCategories.includes(product?.dress_type)
//       );
//     }

//     console.log("updatedProducts", updatedProducts);

//     if (searchQuery.trim()) {
//       updatedProducts = updatedProducts.filter((product) =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredProducts(updatedProducts);
//   }, [
//     products,
//     filteredCategories,
//     searchQuery,
//     filteredSubCategories,
//     currentPage,
//   ]);

//   const [openSubCat, setOpenSubCat] = useState(null);
//   const handleFilterChange = (checkedValues) => {
//     console.log("checkedValues", checkedValues);
//     if (checkedValues.includes("Dresses")) {
//       setOpenSubCat("Dresses");
//       console.log("open the sub category type ok ");
//     } else {
//       setOpenSubCat(null);
//     }
//     setFilteredCategories(checkedValues);
//   };

//   const handleSubFilterChange = (checkedValues) => {
//     setFilteredSubCategories(checkedValues);
//   };

//   const handleSearch = (value) => {
//     setSearchQuery(value);
//   };

//   const handlePageChange = (page, size) => {
//     // setCurrentPage(page);
//     setSearchParams({ page: page });
//     setPageSize(size);
//   };

//   const paginatedProducts = filteredProducts.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const uniqueCategories = [
//     ...new Map(
//       products.map((product) => [product.category?.id, product.category])
//     ).values(),
//   ].filter((category) => category);

//   const uniqueDressTypes = [
//     ...new Set(
//       products
//         .map((product) => product?.dress_type)
//         .filter(
//           (dressType) =>
//             typeof dressType === "string" &&
//             dressType.trim().toLowerCase() !== "undefined"
//         )
//     ),
//   ];

//   if (loading) {
//     return (
//       <Main>
//         <Loader />
//       </Main>
//     );
//   }

//   if (error) return <p>Error fetching products: {error}</p>;

//   const formatDressTypeName = (name) => {
//     const DressLabels = {
//       new_arrivals: "New Arrivals",
//       reference_dresses: "Reference Dresses",
//     };

//     return DressLabels[name] || name;
//   };

//   return (
//     <Main>
//       <Content className="inventory-container">
//         <div className="inventory-filters">
//           <h3>Filter by Category</h3>
//           <Checkbox.Group
//             onChange={handleFilterChange}
//             className="inventory-filter-checkboxes"
//           >
//             {uniqueCategories.map((category) => (
//               <div key={category.id}>
//                 <Checkbox value={category.name}>{category.name}</Checkbox>
//               </div>
//             ))}
//           </Checkbox.Group>

//           {openSubCat == "Dresses" ? (
//             <Checkbox.Group
//               onChange={handleSubFilterChange}
//               value={filteredSubCategories}
//             >
//               <div>
//                 {uniqueDressTypes.length > 0 &&
//                   uniqueDressTypes.map((dressType) => (
//                     <div span={9} key={dressType}>
//                       <Checkbox value={dressType}>
//                         {formatDressTypeName(dressType)}
//                       </Checkbox>
//                     </div>
//                   ))}
//               </div>
//             </Checkbox.Group>
//           ) : (
//             ""
//           )}
//         </div>
//         <div className="inventory-content">
//           <div className="inventory-search">
//             <Search
//               placeholder="Search products..."
//               allowClear
//               onSearch={handleSearch}
//               onChange={(e) => handleSearch(e.target.value)}
//               value={searchQuery}
//               enterButton
//               className="inventory-search-bar"
//             />
//           </div>

//           <div className="inventory-grid">
//             {paginatedProducts.map((product) => {
//               const primaryImage =
//                 product.product_colors?.find(
//                   (colorObj) => colorObj.images.length > 0
//                 )?.images[0]?.image || product.image;

//               return (
//                 <div key={product.id} className="inventory-card">
//                   <Link to={`/inventory/product/${product.id}`}>
//                     <div className="inventory-card-content">
//                       <img
//                         src={`${apiurl}${primaryImage}`}
//                         alt={product.name}
//                         className="inventory-image"
//                       />
//                       <div className="inventory-details">
//                         <h3 className="inventory-title">
//                           {product.name.length > 20
//                             ? product.name.slice(0, 20) + "..."
//                             : product.name}
//                         </h3>

//                         <p className="inventory-category">
//                           Category:{" "}
//                           <span>{product.category?.name || "N/A"}</span>
//                         </p>
//                         <p className="inventory-category">
//                           Weight: <span>{product.weight} grams</span>
//                         </p>

//                         <p className="inventory-colors-title">Varients</p>
//                         <ul className="inventory-colors-list">
//                           {product.product_colors
//                             .slice(0, 2)
//                             .map((colorObj) => (
//                               <li
//                                 key={colorObj.color.id}
//                                 className="inventory-color-item"
//                               >
//                                 <strong>{colorObj.color.name}</strong> - Stock:{" "}
//                                 {colorObj.stock_quantity}, ₹{colorObj.price}
//                               </li>
//                             ))}
//                           {product.product_colors.length > 2 && (
//                             <li className="inventory-color-item">
//                               +{product.product_colors.length - 2} more
//                             </li>
//                           )}
//                         </ul>
//                       </div>
//                     </div>
//                   </Link>
//                 </div>
//               );
//             })}
//           </div>

//           {}
//           {filteredProducts.length > pageSize && (
//             <Pagination
//               current={currentPage}
//               pageSize={pageSize}
//               total={totalProsCount-10}
//               onChange={handlePageChange}
//               showSizeChanger
//               onShowSizeChange={handlePageChange}
//               className="inventory-pagination"
//             />
//           )}
//         </div>
//       </Content>
//     </Main>
//   );
// };

// export default Inventory;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/productsSlice";
import { Layout, Checkbox, Input, Pagination } from "antd";
import { Link, useSearchParams } from "react-router-dom";
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
  const [pageSize, setPageSize] = useState(8);
  const [error, setError] = useState(false);
  const [totalProsCount, SetTotalProsCount] = useState(5);
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const [products, setProducts] = useState([]);
  const [selectedDressTypes, setSelectedDressTypes] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState(null);
  const [openSubCat, setOpenSubCat] = useState(null);

  // useEffect(() => {
  //   // dispatch(fetchProducts());
  // }, [dispatch,searchQuery]);

  useEffect(() => {
    fetchPaginatedProducts();
  }, [currentPage, searchQuery]); // 👈 Trigger fetch on page or search change

  function fetchPaginatedProducts() {
    setLoading(true);
    const urlWithPage = `${apiurl}/admin-products/?page=${currentPage}&search=${encodeURIComponent(
      searchQuery
    )}`;
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

  useEffect(() => {
    let updatedProducts = products;

    if (filteredCategories.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        filteredCategories.includes(product.category?.name)
      );
    }

    if (filteredSubCategories?.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        filteredSubCategories.includes(product?.dress_type)
      );
    }

    setFilteredProducts(updatedProducts);
  }, [products, filteredCategories, filteredSubCategories, currentPage]);

  const handleFilterChange = (checkedValues) => {
    if (checkedValues.includes("Dresses")) {
      setOpenSubCat("Dresses");
    } else {
      setOpenSubCat(null);
    }
    setFilteredCategories(checkedValues);
  };

  const handleSubFilterChange = (checkedValues) => {
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

  const uniqueCategories = [
    ...new Map(
      products.map((product) => [product.category?.id, product.category])
    ).values(),
  ].filter((category) => category);

  const uniqueDressTypes = [
    ...new Set(
      products
        .map((product) => product?.dress_type)
        .filter(
          (dressType) =>
            typeof dressType === "string" &&
            dressType.trim().toLowerCase() !== "undefined"
        )
    ),
  ];

  if (loading) {
    return (
      <Main>
        <Loader />
      </Main>
    );
  }

  if (error) return <p>Error fetching products: {error.message}</p>;

  const formatDressTypeName = (name) => {
    const DressLabels = {
      new_arrivals: "New Arrivals",
      reference_dresses: "Reference Dresses",
    };
    return DressLabels[name] || name;
  };

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
                <Checkbox value={category.name}>{category.name}</Checkbox>
              </div>
            ))}
          </Checkbox.Group>

          {openSubCat === "Dresses" && (
            <Checkbox.Group
              onChange={handleSubFilterChange}
              value={filteredSubCategories}
            >
              <div>
                {uniqueDressTypes.length > 0 &&
                  uniqueDressTypes.map((dressType) => (
                    <div span={9} key={dressType}>
                      <Checkbox value={dressType}>
                        {formatDressTypeName(dressType)}
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
            {filteredProducts.map((product) => {
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

          {filteredProducts.length > 0 && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalProsCount-8}
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
