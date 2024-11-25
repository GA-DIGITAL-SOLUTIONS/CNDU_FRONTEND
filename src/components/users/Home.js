import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/productsSlice";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Select, InputNumber } from "antd";
import { addCartItem, fetchCartItems } from "../../store/cartSlice";
import { addWishlistItem, fetchWishlistItems } from "../../store/wishListSlice";

import { logout } from "../../store/authSlice";
import { fetchOutfits } from "../../store/OutfitSlice";
import Body from "./Body/Body";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((store) => store.products);
  const { apiurl, access_token } = useSelector((store) => store.auth);
  console.log("products", products);
  const cartStoreItems = useSelector((state) => state.cart.items);
  console.log("cartStore", cartStoreItems);
  const wishListItems = useSelector((state) => state.wishlist.items);
  const [selectedOptions, setSelectedOptions] = useState({});
  console.log("wishitems", wishListItems);

  useEffect(() => {
    dispatch(fetchProducts());
    // dispatch(fetchWishlistItems({ apiurl, access_token }));
    dispatch(fetchOutfits({ apiurl }));
  }, [dispatch]);
  console.log("selectedOptions", selectedOptions);

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  }

  const handleAddToCart = async (product) => {
    const selectedColor = selectedOptions[product.id]?.color;
    const selectedQuantity = selectedOptions[product.id]?.quantity || 1;
    const productInCart = cartStoreItems.find(
      (item) => item.object_id === product.id
    );

    console.log("productInCart", productInCart);
    if (!productInCart) {
      const item = {
        item_id: product.id,
        type: "product",
        quantity: selectedQuantity,
        color: selectedColor,
      };
      try {
        const resultAction = await dispatch(
          addCartItem({ apiurl, access_token, item })
        );
        if (addCartItem.fulfilled.match(resultAction)) {
          console.log("Item added to cart:", resultAction.payload);

          dispatch(fetchCartItems({ apiurl, access_token }));
        }
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }
    } else {
      console.log(`Product with ID ${product.id} is already in the cart.`);
    }
  };

  // const handleAddToWishlist = async (product) => {
  //   console.log("Add to wishlist:", product.id);
  //   console.log("Wishlist items:", wishListItems);

  //   // Check if `wishListItems` is an array before using `.some()`
  //   if (Array.isArray(wishListItems)) {
  //     const itemExists = wishListItems.some(
  //       (item) => item.object_id === product.id
  //     );

  //     if (!itemExists) {
  //       const item = {
  //         item_id: product.id,
  //         type: "product", // Update this as needed
  //       };

  //       try {
  //         // Dispatch the `addWishlistItem` action and unwrap the result
  //         const result = await dispatch(
  //           addWishlistItem({ apiurl, access_token, item })
  //         ).unwrap();

  //         // If the item is successfully added, dispatch `fetchWishlistItems`
  //         console.log("Item added successfully:", result);
  //         dispatch(fetchWishlistItems({ apiurl, access_token }));
  //       } catch (error) {
  //         console.error("Failed to add item to wishlist:", error);
  //       }
  //     } else {
  //       console.log(
  //         `Product with ID ${product.id} is already in the wishlist.`
  //       );
  //     }
  //   } else {
  //     console.error("Wishlist items are not in array format.");
  //   }
  // };

  const OpenCart = () => {
    navigate(`/cart`);
  };
  const OpenWishList = () => {
    navigate("/wishlist");
    console.log("try to do dispatch for wishlist here ");
  };

  const openOrders = () => {
    navigate("/orders");
    console.log("here also we can fetch the orders ");
  };
  const Logout = () => {
    dispatch(logout());
    navigate("/logout");
    console.log("successfully logged out");
  };
  const OpenOutfits = () => {
    navigate("/outfits");
  };

  return (
    <div>
      {/* <Button type="primary" onClick={OpenCart}>
        CART
      </Button>
      <Button type="primary" onClick={OpenOutfits}>
        Outfits
      </Button>
      <Button
        style={{ backgroundColor: "gray", color: "white" }}
        onClick={openOrders}
      >
        orders
      </Button>
      <Button
        style={{ backgroundColor: "#FFA500", color: "#ffffff" }}
        onClick={OpenWishList}
      >
        Wishlist
      </Button>
      <Button type="primary" danger onClick={Logout}>
        Logout
      </Button> */}

      <Body />

      {/* {products && products.length > 0 ? (
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                cover={
                  <img src={`${apiurl}${product.image}`} alt={product.name} />
                }
                actions={[
                  <Button
                    type="primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to cart
                  </Button>,
                  <Button type="default"
                  onClick={() => handleAddToWishlist(product)}
                  >Add to wishlist</Button>,
                ]}
              >
                <Card.Meta
                  title={
                    <Link to={`/Home/product/${product.id}`}>
                      {product.name}
                    </Link>
                  }
                  description={`Quantity: ${product.stock_quantity}`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div>No products available.</div>
      )} */}
    </div>
  );
};

export default Home;
