import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col,  } from "antd";
import {
  fetchWishlistItems,
  removeWishlistItem,
} from "../../../store/wishListSlice";
import { addCartItem, addToCart, fetchCartItems } from "../../../store/cartSlice"; // Import addToCart action
import { useDispatch, useSelector } from "react-redux";
import Heading from "../Heading/Heading";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Importing icons
import { useNavigate } from "react-router-dom";
const WishlistTab = () => {
  const { items } = useSelector((state) => state.wishlist);
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const Navigate=useNavigate()
  const [cartitems, setcartitems] = useState(items); // Initial state from items
  const dispatch = useDispatch();

  // Fetch wishlist items on component mount
  useEffect(() => {
    dispatch(fetchWishlistItems({ apiurl, access_token }));
  }, [access_token, apiurl, dispatch]);

  // Update state when items change
  useEffect(() => {
    console.log("wishlistItems", items);
    setcartitems(items);
  }, [items]);

  // Handle removing an item from the wishlist
  const handleRemove = (id) => {
    console.log("delete this wishlist id ", id);
    dispatch(removeWishlistItem({ apiurl, access_token, itemId: id }))
      .unwrap()
      .then(() => {
        setcartitems((prevItems) => prevItems.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Failed to remove item:", error);
      });
  };


  // Handle adding an item to the cart
  const handleAddToCart = async (wishlistItem) => {
  console.log("Type:", wishlistItem.product.type);
  console.log("Product color id:", wishlistItem.product.id);

  let item; // Declare `item` variable to use in the scope

  if (wishlistItem.product.type === "product") {
    item = {
      item_id: wishlistItem.product.id, 
      quantity: 1.5,
    };
  } else if (wishlistItem.product.type === "fabric") {
    item = {
      item_id: wishlistItem.product.id, 
      quantity: 1,
    };
  }else{
    item = {// for the combination bro
      item_id: wishlistItem.product.id, 
      quantity: 1,
    };
  }


  try {
    const resultAction = await dispatch(
      addCartItem({ apiurl, access_token, item })
    );
    if (addCartItem.fulfilled.match(resultAction)) {
      console.log("Item added to cart:", resultAction.payload);
      Navigate("/cart"); 
      dispatch(fetchCartItems({ apiurl, access_token }));
    }
  } catch (error) {
    console.error("Failed to add item to cart:", error);
  }
};

  // Define columns for the Ant Design table
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
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </Col>
            <Col style={{ flex: 1 }}>
              <p style={{ fontWeight: "bold", margin: 0 }}>{product.product}</p>
              <p style={{ fontWeight: "bold", margin: 0 }}>
                color: {product.color?.name}
              </p>
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
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
