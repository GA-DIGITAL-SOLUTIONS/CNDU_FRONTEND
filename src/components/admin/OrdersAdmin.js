import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../store/orderSlice";
import { Table } from "antd";
import { Link } from "react-router-dom";
import Main from "./AdminLayout/AdminLayout";
import PrintInvoiceButton from "../utils/DownloadInvoice";

const OrdersAdmin = () => {
	const dispatch = useDispatch();
	const { apiurl, access_token } = useSelector((state) => state.auth);
	const [ordersData, setOrdersData] = useState([]);

	useEffect(() => {
		dispatch(fetchOrders({ apiurl, access_token }));
	}, [dispatch, apiurl, access_token]);

	const { orders } = useSelector((state) => state.orders);

	useEffect(() => {
		if (orders && orders.length > 0) {
			const modifiedOrders = orders.map((order) => ({
				...order,
				username: order.user?.username || "N/A",
			}));
			setOrdersData(modifiedOrders);
		}
	}, [orders]);

	const columns = [
		{
			title: "Order ID",
			dataIndex: "id",
			key: "id",
			render: (id) => <Link to={`/adminorders/${id}`}>#{id}</Link>,
		},
		{
			title: "Customer Name",
			dataIndex: "username",
			key: "username",
		},
		{
			title: "Ordered At",
			dataIndex: "created_at",
			key: "created_at",
			render: (text) => new Date(text).toLocaleString(),
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
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
		{
			title: "Print Invoice",
			dataIndex: "id",
			key: "id2",
			render: (id) => <PrintInvoiceButton orderId={id} />,
		},
	];

	return (
		<Main>
			<div className="OrdersforAdmin">
				<Table
					style={{ margin: "0px 50px" }}
					dataSource={ordersData}
					columns={columns}
					rowKey="id"
					pagination={{ pageSize: 10 }}
				/>
			</div>
		</Main>
	);
};

export default OrdersAdmin;
