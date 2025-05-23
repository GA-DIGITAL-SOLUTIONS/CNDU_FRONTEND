import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, message } from "antd";
import {
  fetchWishlistItems,
  removeWishlistItem,
} from "../../../store/wishListSlice";
import { addCartItem, fetchCartItems } from "../../../store/cartSlice"; // Import addToCart action
import { useDispatch, useSelector } from "react-redux";
import Heading from "../Heading/Heading";
import {  DeleteOutlined } from "@ant-design/icons"; // Importing icons
import { useNavigate } from "react-router-dom";

const WishlistTab = () => {
  const { items } = useSelector((state) => state.wishlist);
  const { apiurl, access_token, userRole } = useSelector((state) => state.auth);
  const Navigate = useNavigate();
  const [cartitems, setcartitems] = useState(items); // Initial state from items
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWishlistItems({ apiurl, access_token }));
  }, [access_token, apiurl, dispatch]);

  useEffect(() => {
    // console.log("wishlistItems", items);
    setcartitems(items);
  }, [items]);

  const handleRemove = (id) => {
    // console.log("delete this wishlist id ", id);
    dispatch(removeWishlistItem({ apiurl, access_token, itemId: id }))
      .unwrap()
      .then(() => {
        setcartitems((prevItems) => prevItems.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Failed to remove item:", error);
      });
  };

  const handleAddToCart = async (wishlistItem) => {
    // console.log("Type:", wishlistItem.product.type);
    // console.log("Product color id:", wishlistItem.product.id);
    let item;
    if (userRole) {
      if (wishlistItem.product.type === "product") {
        item = {
          item_id: wishlistItem.product.id,
          quantity: 1,
        };
      } else if (wishlistItem?.product.type === "fabric") {
        console.log("wishlistItem");
        if (wishlistItem?.product?.zero_p) {
          item = {
            item_id: wishlistItem?.product.id,
            quantity: 1.5,
          };
        } else {
          item = {
            item_id: wishlistItem?.product?.id,
            quantity: 1,
          };
        }
      } else {
        item = {
          item_id: wishlistItem?.product?.id,
          quantity: 1,
        };
      }
      try {
        const resultAction = await dispatch(
          addCartItem({ apiurl, access_token, item })
        );
        if (addCartItem.fulfilled.match(resultAction)) {
          // console.log("Item added to cart:", resultAction.payload);
          Navigate("/cart");
          dispatch(fetchCartItems({ apiurl, access_token }));
        }
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }
    } else {
      message.error("please Login ");
    }
  };

  const columns = [
    {
      title: "", // No column name
      key: "actions",
      width: 50,
      align: "center",
      className: "delete-column",
      render: (_, record) => (
        <DeleteOutlined
          onClick={() => handleRemove(record.id)}
          className="deleted_icon"
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 250,
      render: (product) => {
        const firstImage =
          product.images?.[0]?.image || "https://via.placeholder.com/80";
        return (
          <Row
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Col>
              <img
                src={`${apiurl}${firstImage}`}
                alt={product.product}
                className="wislist_images"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </Col>
            <Col style={{ flex: 1 }}>
              <p style={{ fontWeight: "bold", margin: 0 }}>{product.product}</p>
              <p style={{ fontWeight: "bold", margin: 0 }}>
                color: {product?.color?.name}
              </p>
              {product?.size && (
                <p style={{ fontWeight: "bold", margin: 0 }}>
                  Size: {product.size}
                </p>
              )}
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price, record) => {
        let isItemDiscount =
          record.product.discount_price < record.product.price;
        let isFabric = record.product.type === "fabric";

        return (
          <div>
            {isItemDiscount ? (
              <div>
                <span style={{ textDecoration: "line-through", color: "red" }}>
                  ₹ {record.product.price}
                </span>
                <br />
                <span style={{ color: "green", fontWeight: "bold" }}>
                  ₹ {record.product.discount_price}
                </span>
              </div>
            ) : (
              <div>
                <span>₹ {record.product.price}</span>
              </div>
            )}
            {isFabric && <span> per meter</span>}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "addToCart",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleAddToCart(record)}
          className="add-to-cart-btn"
        >
          Add to Cart
        </Button>
      ),
    },
  ];

  // Table data source
  const dataSource = cartitems.map((item) => ({
    key: item.id,
    product: item.item,
    price: item.item.price,
    id: item.id,
  }));

  return (
    <div className="Wishlist_tab">
      <Heading>My Wishlist</Heading>
      <Table
        style={{ width: "700px" }}
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="id"
      />
    </div>
  );
};

export default WishlistTab;
