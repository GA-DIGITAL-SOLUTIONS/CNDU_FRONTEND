import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuth";
import { useNavigate } from "react-router-dom";
import { Table, Button, message } from "antd";
import { HeartFilled } from "@ant-design/icons";
import Main from "./Layout";
import "./Wishlist.css";

const WishList = () => {
	const navigate = useNavigate();
	const { apiurl, token } = useAuth();
	const [wishlist, setWishlist] = useState([]);

	const getWishlist = async () => {
		try {
			const response = await fetch(`${apiurl}/wishlist/`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setWishlist(data.data);
			}
		} catch (error) {
			console.error("Error fetching wishlist:", error);
		}
	};

	useEffect(() => {
		getWishlist();
	}, []);

	const toggleWishlist = async (bookId) => {
		try {
			const response = await fetch(`${apiurl}/wishlist/`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: bookId }),
			});
			const data = await response.json();
			if (response.ok) {
				message.success(data.message);
				getWishlist();
			} else {
				message.error(data.error);
			}
		} catch (error) {
			console.error("Error toggling wishlist:", error);
		}
	};
	const AddCart = async (id) => {
		try {
			const response = await fetch(`${apiurl}/cart/`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ book: id }),
			});
			const data = await response.json();
			if (response.ok) {
				message.success(data.message);
			} else {
				message.error(data.error);
			}
		} catch (error) {
			message.error("Failed to add to Cart.");
		}
	};

	const columns = [
		{
			title: "Product",
			dataIndex: "product",
			key: "product",
			render: (text, record) => (
				<div className="item-details">
					<img
						src={`${apiurl}${record.book.image}`}
						alt={record.book.title}
						className="book-list-image"
						onClick={() => navigate(`/catalogue/${record.book.id}`)}
					/>
					<span className="item-title">{record.book.title}</span>
				</div>
			),
		},
		{
			title: "Stock Status",
			dataIndex: "stockStatus",
			key: "stockStatus",
			render: (text, record) => (
				<span className={record.book.num_of_copies>0 ? "in-stock" : "out-of-stock"}>
					{record.book.num_of_copies > 0 ? "In Stock" : "Out of Stock"}
				</span>
			),
		},
		{
			title: "Actions",
			dataIndex: "actions",
			key: "actions",
			render: (text, record) => (
				<div className="item-actions">
					<Button
						icon={<HeartFilled />}
						onClick={() => toggleWishlist(record.book.id)}
						type="link">
						Remove
					</Button>
					<Button
						type="primary"
						disabled={!record.book.num_of_copies > 0}
						onClick={() => AddCart(record.book.id)}>
						Add to Cart
					</Button>
				</div>
			),
		},
	];

	return (
		<Main>
			<div className="wishlist-container">
				<Table
					columns={columns}
					dataSource={wishlist}
					rowKey={(record) => record.book.id}
					pagination={false}
				/>
			</div>
		</Main>
	);
};

export default WishList;
