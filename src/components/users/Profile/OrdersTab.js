import React, { useEffect } from 'react';
import { fetchOrders } from '../../../store/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import Heading from '../Heading/Heading';
import { Table } from 'antd';
import { Link, redirect } from 'react-router-dom';

const OrdersTab = () => {
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders({ apiurl, access_token }));
  }, [apiurl, access_token]);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render:(id)=>{
        return <Link to={`/orders/${id}`}>{id}</Link>
      }
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => status || "Unknown",
    },
    {
      title: "Amount Paid",
      dataIndex: "total_discount_price",
      key: "total_discount_price",
      render: (total_discount_price, record) => {
        const shippingCharges = Number(record.shipping_charges) || 0; 
        const amountPaid = (Number(total_discount_price) || 0) + shippingCharges;
        return <span>{`₹${amountPaid.toFixed(2)}`}</span>;
      },
    },
    
  ];

  return (
    <div className="OrdersTab">
      <Heading>Order History</Heading>
      <Table
        style={{ maxWidth: "90vw", margin: "0 auto" }}
        dataSource={orders || []}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </div>
  );
};

export default OrdersTab;

