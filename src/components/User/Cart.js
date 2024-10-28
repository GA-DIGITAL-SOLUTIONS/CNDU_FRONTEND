import React, { useEffect, useState } from "react";
import Main from "./Layout";
import { useAuth } from "../utils/useAuth";
import { Button, message, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import "./cart.css";

const Cart = () => {
	const { token, apiurl } = useAuth();
	const [cartItems, setCartItems] = useState([]);
	const [wishlist, setWishlist] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		getCart();
		getWishlist();
	}, []);

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

	const toggleWishlist = async (bookId) => {
		try {
			const response = await fetch(`${apiurl}/wishlist/`, {
				method: "POST",
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

	const getCart = async () => {
		try {
			const response = await fetch(`${apiurl}/cart/`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			if (response.ok) {
				setCartItems(data.cart);
			} else {
				message.error(data.error);
			}
		} catch (error) {
			message.error("Failed to fetch cart.");
		}
	};

	const isWishlisted = (bookId) => {
		return wishlist.some((item) => item.book.id === bookId);
	};

	const removeCart = async (id) => {
		try {
			const response = await fetch(`${apiurl}/cart/`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: id }),
			});
			const data = await response.json();
			if (response.ok) {
				message.success(data.message);
				await getCart();
			} else {
				message.error(data.error);
			}
		} catch (error) {
			message.error("Failed to remove from cart.");
		}
	};

	return (
		<Main>
			<div className="main-cart">
				{cartItems && cartItems.length > 0 && (
					<div className="main-cart-inner">
						<div className="cartmain-user-cart-container">
							{cartItems.map((item) => (
								<div key={item.id} className="cartmain-user-cart-item">
									<img
										onClick={() => navigate(`/catalogue/${item.book.id}`)}
										src={`${apiurl}${item.book.image}`}
										alt={item.book.title}
										className="cartmain-user-cart-item-image"
									/>
									<div className="cartmain-user-cart-item-details">
										<div>
											<div
												onClick={() => navigate(`/catalogue/${item.book.id}`)}
												className="cartmain-user-cart-item-title">
												{item.book.title}
											</div>
											<div className="cartmain-user-cart-item-author">
												{item.book.author}
											</div>
										</div>
										<div className="cartmain-user-cart-actions">
											<Button
												type="link"
												onClick={() => removeCart(item.id)}
												className="cartmain-user-cart-remove-button">
												<DeleteOutlined />
												Remove From Cart
											</Button>
											<Button
												className="cartmain-user-cart-remove-button"
												icon={
													isWishlisted(item.book.id) ? (
														<HeartFilled />
													) : (
														<HeartOutlined />
													)
												}
												onClick={() => toggleWishlist(item.book.id)}
												type="link">
												{isWishlisted(item.book.id)
													? "Remove from Wishlist"
													: "Add to Wishlist"}
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
				<div className="rent-btn">
					{cartItems.length > 0 ? (
						<Button
							onClick={() => {
								navigate("/rent/all");
							}}>
							Proceed To Rent
						</Button>
					) : (
						<Result
							status="warning"
							title="There are no items in your cart."
							extra={
								<Button
									type="primary"
									key="home"
									onClick={() => navigate("/catalogue")}>
									Go to catalogue
								</Button>
							}
						/>
					)}
				</div>
			</div>
		</Main>
	);
};

export default Cart;
