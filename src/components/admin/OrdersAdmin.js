import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../store/orderSlice"; 
import Heading from '../users/Heading/Heading';
import { Table } from 'antd';
import { Link } from 'react-router-dom';

const OrdersAdmin = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    // Dispatch the fetchOrders action
    dispatch(fetchOrders({ apiurl, access_token }));
  }, [dispatch, apiurl, access_token]);

  const { orders } = useSelector((state) => state.orders);

  // Ensure we modify the orders structure to include user.username
  useEffect(() => {
    if (orders && orders.length > 0) {
      const modifiedOrders = orders.map(order => ({
        ...order,
        username: order.user?.username || 'N/A',
      }));
      setOrdersData(modifiedOrders);
    }
  }, [orders]);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Link to={`/adminorder/${id}`}>{id}</Link>,
    },
    {
      title: "Customer Name",
      dataIndex: "username", // Now directly using username field from modified order data
      key: "username",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleString(), // Format the date
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Total Price",
      dataIndex: "total_order_price",
      key: "total_order_price",
      render: (price) => `₹${price.toFixed(2)}`, // Format price with currency symbol
    },
  ];

  return (
    <div className='OrdersforAdmin'>
      <Heading>Order List</Heading>
      <Table
        style={{ margin: "0px 50px" }}
        dataSource={ordersData}  // Use the modified ordersData array
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default OrdersAdmin;
