import React, { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Spin, message } from "antd";
import {
	UserOutlined,
	BookOutlined,
	ShoppingCartOutlined,
	DollarOutlined,
	HeartOutlined,
	CommentOutlined,
	CrownOutlined,
	GiftOutlined,
} from "@ant-design/icons";
import "./AdminMetrics.css";
import { useAuth } from "../utils/useAuth";
import Main from "./Layout";

const AdminMetrics = () => {
	const [metrics, setMetrics] = useState(null);

	const { apiurl } = useAuth();
	useEffect(() => {
		const fetchMetrics = async () => {
			try {
				const response = await fetch(`${apiurl}/metrics/`, {
					method: "GET",
				});

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();
				setMetrics(data);
			} catch (err) {
				message.error("Failed to fetch metrics");
			}
		};

		fetchMetrics();
	}, []);

	return (
		<Main>
			{metrics && (
				<div className="metrics-container">
					<Row gutter={16}>
						<Col span={8}>
							<Card className="metrics-card bg-blue">
								<Statistic
									title="Total Users"
									value={metrics.total_users}
									prefix={<UserOutlined />}
								/>
							</Card>
						</Col>
						<Col span={8}>
							<Card className="metrics-card bg-green">
								<Statistic
									title="Total Books"
									value={metrics.total_books}
									prefix={<BookOutlined />}
								/>
							</Card>
						</Col>
						<Col span={8}>
							<Card className="metrics-card bg-orange">
								<Statistic
									title="Total Orders"
									value={metrics.total_orders}
									prefix={<ShoppingCartOutlined />}
								/>
							</Card>
						</Col>
					</Row>
					<Row gutter={16} className="mt-4">
						<Col span={8}>
							<Card className="metrics-card bg-purple">
								<Statistic
									title="Total Subscriptions"
									value={metrics.total_subscriptions}
									prefix={<CrownOutlined />}
								/>
							</Card>
						</Col>
						<Col span={8}>
							<Card className="metrics-card bg-red">
								<Statistic
									title="Total Payments"
									value={`$${metrics.total_payments.toFixed(2)}`}
									prefix={<DollarOutlined />}
								/>
							</Card>
						</Col>
						<Col span={8}>
							<Card className="metrics-card bg-yellow">
								<Statistic
									title="Total Wishlist Items"
									value={metrics.total_wishlist_items}
									prefix={<HeartOutlined />}
								/>
							</Card>
						</Col>
					</Row>
					<Row gutter={16} className="mt-4">
						<Col span={12}>
							<Card className="metrics-card bg-cyan">
								<Statistic
									title="Total Comments"
									value={metrics.total_comments}
									prefix={<CommentOutlined />}
								/>
							</Card>
						</Col>
						<Col span={12}>
							<Card className="metrics-card bg-magenta">
								<Statistic
									title="Active Subscriptions"
									value={metrics.active_subscriptions}
									prefix={<GiftOutlined />}
								/>
							</Card>
						</Col>
					</Row>
				</div>
			)}
		</Main>
	);
};

export default AdminMetrics;
