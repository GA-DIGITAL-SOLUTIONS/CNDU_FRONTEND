import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCartItems } from "../../store/cartSlice";
import { fetchProducts } from "../../store/productsSlice";
import CartItem from "./CartItem";
import { Card, Button } from "antd"; // Ant Design components
import { placeOrder } from "../../store/orderSlice";
const Cart = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const {
    items,
    loading: cartLoading,
    error,
  } = useSelector((state) => state.cart);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );

  const Navigate=useNavigate()

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (apiurl && access_token) {
      dispatch(fetchCartItems({ apiurl, access_token }));
      dispatch(fetchProducts());
    }
  }, [dispatch, apiurl, access_token]);

  useEffect(() => {
    if (products.length > 0 && items.length > 0) {
      const itemIdsInCart = new Set(items.map((item) => item.object_id));
      const cartProducts = products.filter((product) =>
        itemIdsInCart.has(product.id)
      );

      let total = 0;
      cartProducts.forEach((product) => {
        total += parseFloat(product.price) || 0; // Convert price to number
      });

      setTotalPrice(total);
      setTotalItems(cartProducts.length);
    }
  }, [items, products]);

  const handlePlaceOrder = () => {
   
    dispatch(placeOrder({ apiurl, access_token }))
      .unwrap()
      .then(() => {
        Navigate('/orders'); 
      })
      .catch((error) => {
       
        console.log('Order failed:', error);
      
      });
  };
  if (cartLoading || productsLoading) {
    return <div>Loading cart items...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const itemIdsInCart = new Set(items.map((item) => item.object_id));
  const cartProducts = products.filter((product) =>
    itemIdsInCart.has(product.id)
  );

  return (
    <div>
      <h1>Cart</h1>

      {items.map((cartitem) => {
  return <CartItem key={cartitem.id} cartitem={cartitem} />;
})}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "30px", // Adjust space between columns
          flexWrap: "wrap", // Allow items to wrap on smaller screens
        }}
      >
    
     

       
        <div style={{ flex: 1, minWidth: "300px" }}>
          <Card style={{ width: "75%" }} title="Order Summary">
            <p>Total Items: {totalItems}</p>
            <p>Total Price: Rs {totalPrice.toFixed(2)}</p>
            <Button type="primary" block onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </Card>
        </div>
      </div>
    </div> 
  );
};

export default Cart;
