import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button } from "antd";
import {
  fetchCartItems,
  removeCartItem,
  updateQuantity,
} from "../../store/cartSlice";

const CartItem = ({ cartitem }) => {
  const { apiurl, access_token } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.products);
  // console.log("prodts", products);

  // console.log("got the actuall quentity", cartitem.quantity);
  const [quantity, setQuantity] = useState(cartitem.quantity);
  // console.log("state is ", quantity);
  const item = products.find((pro) => pro.id === cartitem.object_id);
  // console.log("orginal item ", item);


  // console.log("qqqqqqqqqqqqqqqqqqqq",quantity)

  // console.log("item",item.stock_quantity)

  const itemId = {
    cart_item_id: cartitem.id,
  };

  

  const handleRemove = () => {
    dispatch(removeCartItem({ apiurl, access_token, itemId }))
    .unwrap()
    .then(() => {
      dispatch(fetchCartItems({ apiurl, access_token }));
    })
    .catch((error) => {
      console.error("Failed to remove item:", error);
    });
  
  };


  const handleQuantityChange = (method) => {
    // console.log("handleQuantityChangeis working ");
    if (method === "inc") {
      const updateObj = {
        cart_item_id: cartitem.id,
        quantity: 1,
      };
      dispatch(updateQuantity({ apiurl, access_token, updateObj }));
      // dispatch(fetchCartItems({ apiurl, access_token }));

      // console.log("updated items", items);
    } else if (method === "dec") {
      const updateObj = {
        cart_item_id: cartitem.id,
        quantity: -1,
      };
      dispatch(updateQuantity({ apiurl, access_token, updateObj }));
    }
  };
  // Increase quantity function
  const increaseQuantity = () => {
    // console.log("inc by 1 ");
    // console.log(quantity);
    if (quantity <= item.stock_quantity) {
      setQuantity(quantity + 1);
      handleQuantityChange("inc");
    }
  };

  // Decrease quantity function
  const decreaseQuantity = () => {
    if (quantity >= 1) {
      setQuantity(quantity - 1);
      handleQuantityChange("dec");
    }
  };

  return (
    <Card
      style={{ margin: "10px", width: "250px" }}
      cover={
        <img
          src={`${apiurl}${item.image}`}
          alt={item.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
      }
      actions={[
        <Button type="primary" danger onClick={handleRemove}>
          Remove
        </Button>,
      ]}
    >
      <Card.Meta
        title={item.name}
        description={
          <>
            {/* <p>Quantity:</p> */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Button onClick={decreaseQuantity} disabled={quantity <= 1}>
                -
              </Button>
              <span>{quantity}</span>
              <Button
                onClick={increaseQuantity}
                disabled={quantity >= item.stock_quantity}
              >
                +
              </Button>
            </div>
            <p>Stock: {item.stock_quantity}</p>
            <p>{item.description}</p>
            <p>price: {item.price}</p>
          </>
        }
      />
    </Card>
  );
};

export default CartItem;
