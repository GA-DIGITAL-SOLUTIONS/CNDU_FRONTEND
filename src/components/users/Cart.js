import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCartItems } from "../../store/cartSlice";
import { fetchProducts } from "../../store/productsSlice";
import CartItem from "./CartItem";
import { Card, Button } from "antd"; // Ant Design components
import { placeOrder } from "../../store/orderSlice";
import { Link } from "react-router-dom";
import Heading from "./Heading/Heading";
const Cart = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const {
    items,
    loading: cartLoading,
    error,
  } = useSelector((state) => state.cart);
  console.log("cartobj ", items);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );

  const Navigate = useNavigate();

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (apiurl && access_token) {
      dispatch(fetchCartItems({ apiurl, access_token }));
      dispatch(fetchProducts());
    }
  }, [dispatch, apiurl, access_token]);

  // useEffect(() => {
  //   if (products.length > 0 && items.length > 0) {
  //     const itemIdsInCart = new Set(items.map((item) => item.object_id));
  //     const cartProducts = products.filter((product) =>
  //       itemIdsInCart.has(product.id)
  //     );

  //     let total = 0;
  //     cartProducts.forEach((product) => {
  //       total += parseFloat(product.price) || 0; // Convert price to number
  //     });

  //     setTotalPrice(total);
  //     setTotalItems(cartProducts.length);
  //   }
  // }, [items, products]);

  const handlePlaceOrder = () => {// i need to do add this later 
    dispatch(placeOrder({ apiurl, access_token }))
      .unwrap()
      .then(() => {
        Navigate("/orders");
        dispatch(fetchCartItems({ apiurl, access_token }));
      })
      .catch((error) => {
        console.log("Order failed:", error);
      });
  };
  if (cartLoading || productsLoading) {
    return <div>Loading cart items...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // const itemIdsInCart = new Set(items.map((item) => item.object_id));
  // const cartProducts = products.filter((product) =>
  //   itemIdsInCart.has(product.id)
  // );

  console.log("i", items, "p", products);

  return (
    <>
      <Heading>cart</Heading>

      {
      /*
        HERE I NEED TO ADD THE CART SINGLE CART ITEM PAGE 
      
      {items?.item?.map((item) => {
        return (
          <div key={item.id}>
            <h1>Cart ID: {item.id}</h1>
            {item.items.map((singleitem, idx) => {
              return <CartItem key={idx} cartitem={singleitem} />;
            })}
          </div>
        );
      })} */}
      <h1> Totalcart Id :{items.id}</h1>
      {/* {items?.items?.map((singlecartid, idx) => {
        return (
          <ul key={idx}>
            <li> cart single item id : {singlecartid}</li>
          </ul>
        );
      })} */}
      <Button
                type="primary"
                block
                onClick={handlePlaceOrder}
                style={{ width: "100px" }}
              >
                Place Order
              </Button>

      {/* <div style={{ display: "flex" }}>
        {items.map((cartitem) => {
          return <CartItem key={cartitem.id} cartitem={cartitem} />;
        })}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "30px", 
            flexWrap: "wrap", 
          }}
        >
          <div style={{ flex: 1, minWidth: "300px" }}>
            <Card style={{ width: "100%" }} title="Order Summary">
              <p>Total Items: {totalItems}</p>
              <p>Total Price: Rs {totalPrice.toFixed(2)}</p>
              <Button
                type="primary"
                block
                onClick={handlePlaceOrder}
                style={{ width: "100px" }}
              >
                Place Order
              </Button>
            </Card>

            <Link to="/orders">
              <Button
                type="primary"
                block
                // onClick={han}
                style={{
                  width: "100px",
                  backgroundColor: "gray",
                  color: "white",
                  marginTop: "20px",
                }}
              >
                Orders
              </Button>
            </Link>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Cart;
