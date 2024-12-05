import React, { useState } from "react";
import { Layout, Row, Col, Table, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import DashboardCard from "./DashboardCard/DashboardCard";
import "./AdminDashboard.css";
import { Outlet } from "react-router-dom";
import FirstIcon from "./images/FirstCardIcon.svg";
import SecondIcon from "./images/SecondCardIcon.svg";
import ThirdIcon from "./images/ThirdCardIcon.svg";
import FourtIcon from "./images/FourtCardIcon.svg";

import { fetchOrders } from "../../../store/orderSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import CanvasJSReact from "@canvasjs/react-charts";
import { useDispatch, useSelector } from "react-redux";
import Main from "../AdminLayout/AdminLayout";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const { Content } = Layout;

const AdminDashBoard = () => {
	const dispatch = useDispatch();
	const { apiurl, access_token } = useSelector((state) => state.auth);

	const { orders } = useSelector((state) => state.orders);

	const cardsData = [
		{ title: "950", subtitle: "Title", Icon: FirstIcon },
		{ title: "120", subtitle: "Products", Icon: SecondIcon },
		{ title: "30", subtitle: "Fabrics", Icon: ThirdIcon },
		{ title: "45", subtitle: "Users", Icon: FourtIcon },
	];

	const [ordersData, setOrdersData] = useState([]);

	useEffect(() => {
		dispatch(fetchOrders({ apiurl, access_token }));
	}, [dispatch, apiurl, access_token]);

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
			render: (id) => <Link to={`/adminorder/${id}`}>{id}</Link>,
		},
		{
			title: "Customer Name",
			dataIndex: "username",
			key: "username",
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
		},
		{
			title: "Total Price",
			dataIndex: "total_order_price",
			key: "total_order_price",
			render: (price) => `₹${price.toFixed(2)}`,
		},
	];

	return (
		<Main>
			<Content className="custom-content">
				<Outlet />
				<div className="cards_Container">
					{cardsData.map((card, index) => (
						<DashboardCard
							key={index}
							title={card.title}
							subtitle={card.subtitle}
							Icon={card.Icon}
						/>
					))}
				</div>
			</Content>

			<div className="graph_bestseller">
				<div style={{ height: "200px", width: "600px" }}>
					{/* <CanvasJSChart options={options} /> */}
				</div>

				<div className="bestSeller">
					<div className="heading">
						<h2>Best Seller</h2>
						<h2>icon</h2>
					</div>
					<div className="cards_container">
						<div className="bestseller_cards" style={{ padding: "20px" }}>
							<Row
								gutter={16}
								align="middle"
								style={{ height: "70px", marginTop: "10px" }}>
								{}
								<Col span={8}>
									<img
										src="./dummyimage.jpg"
										alt="im"
										style={{ width: "55px", borderRadius: "8px" }}></img>
								</Col>
								{}
								<Col span={8} style={{ height: "100%" }}>
									<h3 style={{ margin: "0", fontWeight: "bold" }}>Heading</h3>
									<h4 style={{ margin: "5px 0", color: "#888" }}>₹126.50</h4>
								</Col>

								{}
								<Col span={8}>
									<h2 style={{ margin: "0", fontWeight: "bold" }}>₹126.50</h2>
									<h3 style={{ margin: "5px 0", color: "#888" }}>Subhead</h3>
								</Col>
							</Row>
							<Row
								gutter={16}
								align="middle"
								style={{ height: "70px", marginTop: "10px" }}>
								{}
								<Col span={8}>
									<img
										src="./dummyimage.jpg"
										style={{ width: "55px", borderRadius: "8px" }}></img>
								</Col>
								{}
								<Col span={8} style={{ height: "100%" }}>
									<h3 style={{ margin: "0", fontWeight: "bold" }}>Heading</h3>
									<h4 style={{ margin: "5px 0", color: "#888" }}>₹126.50</h4>
								</Col>

								{}
								<Col span={8}>
									<h2 style={{ margin: "0", fontWeight: "bold" }}>₹126.50</h2>
									<h3 style={{ margin: "5px 0", color: "#888" }}>Subhead</h3>
								</Col>
							</Row>
							<Row
								gutter={16}
								align="middle"
								style={{ height: "70px", marginTop: "10px" }}>
								{}
								<Col span={8}>
									<img
										src="./dummyimage.jpg"
										style={{ width: "55px", borderRadius: "8px" }}></img>
								</Col>
								{}
								<Col
									span={8}
									style={{
										height: "100%",
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-between",
										alignItems: "center",
									}}>
									<h3 style={{ margin: "0", fontWeight: "bold" }}>Heading</h3>
									<h4 style={{ margin: "5px 0", color: "#888" }}>₹126.50</h4>
								</Col>

								{}
								<Col span={8}>
									<h2 style={{ margin: "0", fontWeight: "bold" }}>₹126.50</h2>
									<h3 style={{ margin: "5px 0", color: "#888" }}>Subhead</h3>
								</Col>
							</Row>
						</div>
						{}
					</div>
				</div>
			</div>

			{}

			<div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginBottom: "10px",
					}}>
					<h2>Recent Orders</h2>
					<Button
						icon={<EllipsisOutlined />}
						style={{ border: "none", background: "none" }}
					/>
				</div>
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

export default AdminDashBoard;
