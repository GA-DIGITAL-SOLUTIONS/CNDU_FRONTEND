import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, removeOrder } from "../../store/orderSlice"; // Assuming you have removeOrder action


import { Card, Col, Row, Typography, Button, Modal } from "antd"; // Import Ant Design components
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const Orders = () => {
  const orders = useSelector((state) => state.orders.orders);
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders({ apiurl, access_token }));
  }, [dispatch, apiurl, access_token]);

  // Function to handle the removal of an order
  const handleRemoveOrder = (orderId) => {
    dispatch(removeOrder({ apiurl, access_token, orderId }))
      .unwrap()
      .then(() => {
        dispatch(fetchOrders({ apiurl, access_token }));
      })
      .catch((error) => {
        console.log("Failed to remove order:", error);
      });
  };

  return (
    <>
      <Title level={2}>Placed Orders</Title>
      {orders.length > 0 ? (
        <Row gutter={16}>
          {orders.map((order) => (
            <Col span={8} key={order.id}>
              {/* Wrap the Card in a Link */}
              <Link to={`/orders/${order.id}`}>
                <Card
                  title={`Order ID: ${order.id}`}
                  bordered={false}
                  style={{ marginBottom: "20px" }}
                  hoverable
                  extra={
                    <Button
                      type="primary"
                      danger
                      onClick={(e) => {
                        e.preventDefault(); // Prevents the card navigation if Cancel is clicked
                        handleRemoveOrder(order.id);
                      }}
                    >
                      Cancel Order
                    </Button>
                  }
                >
                  <p>
                    <Text strong>Status:</Text> {order.status}
                  </p>
                  <p>
                    <Text strong>Total Amount:</Text> ${order.total_amount}
                  </p>
                  <p>
                    <Text strong>Created At:</Text>{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No orders found</p>
      )}
    </>
  );
};

export default Orders;
