import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import { Breadcrumb, Button, message } from "antd";
import Main from "./Layout";
import { HeartFilled, HeartOutlined, BookOutlined } from "@ant-design/icons";

const BookDetail = () => {
	const { id } = useParams();
	const { apiurl, token } = useAuth();
	const [book, setBook] = useState(null);
	const [isWishlist, setIsWishlist] = useState(false);
	const [isAddedToCart, setIsAddedToCart] = useState(false);
	const [comments, setComments] = useState([]);
	const navigate = useNavigate();

	const fetchComments = async () => {
		try {
			const response = await fetch(`${apiurl}/bookreviews/${id}/`);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			setComments(data.data || []);
		} catch (err) {
			message.error("Failed to fetch comments.");
		}
	};

	const updateWishlist = async (action) => {
		if (!token) {
			return message.error("Please log in to manage your wishlist.");
		}
		try {
			const method = action === "add" ? "POST" : "DELETE";
			const response = await fetch(`${apiurl}/wishlist/`, {
				method: method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id }),
			});
			const data = await response.json();
			if (response.ok) {
				message.success(data.message);
				setIsWishlist(action === "add");
			} else {
				message.error(data.error);
			}
		} catch (error) {
			message.error(`Failed to ${action} from wishlist.`);
		}
	};

	const checkWishlistStatus = async () => {
		try {
			const response = await fetch(`${apiurl}/iswishlisted/${id}/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setIsWishlist(data.status);
			}
		} catch (error) {
			message.error("Failed to fetch wishlist status.");
		}
	};

	const updateCart = async (action) => {
		if (!token) {
			return message.error("Please log in to manage your cart.");
		}
		try {
			const method = action === "add" ? "POST" : "DELETE";
			const response = await fetch(`${apiurl}/cart/`, {
				method: method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ book: id }),
			});
			const data = await response.json();
			if (response.ok) {
				message.success(data.message);
				setIsAddedToCart(action === "add");
			} else {
				message.error(data.error);
			}
		} catch (error) {
			message.error(`Failed to ${action} from cart.`);
		}
	};

	const checkCartStatus = async () => {
		try {
			const response = await fetch(`${apiurl}/isaddedtocart/${id}/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setIsAddedToCart(data.status);
			}
		} catch (error) {
			message.error("Failed to fetch cart status.");
		}
	};

	useEffect(() => {
		fetchBookDetails();
		checkWishlistStatus();
		checkCartStatus();
		fetchComments();
	}, [apiurl, id, token]);

	const fetchBookDetails = async () => {
		try {
			const response = await fetch(`${apiurl}/getbook/${id}/`, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setBook(data.book);
			} else {
				message.error("Failed to fetch book details.");
			}
		} catch (error) {
			message.error("Failed to fetch book details.");
		}
	};

	const renderStars = (rating) => {
		return (
			<div className="review-rating">
				{[...Array(5)].map((_, i) => (
					<span
						key={i}
						className={`star ${i < rating ? "full" : "empty"}`}></span>
				))}
			</div>
		);
	};

	return (
		<Main>
			<div className="bd-main">
				<Breadcrumb
					items={[
						{
							title: (
								<Link to={"/catalogue"}>
									<BookOutlined />
									<span>Catalogue</span>
								</Link>
							),
						},
						{
							title: (
								<strong>
									<span>{book?.title}</span>
								</strong>
							),
						},
					]}
				/>
				<div className="book-details-main">
					<div className="book-details-container">
						<div className="book-image-container">
							<Button
								className="wishlist-button"
								onClick={() => updateWishlist(isWishlist ? "remove" : "add")}>
								{isWishlist ? <HeartFilled /> : <HeartOutlined />}
							</Button>
							<img
								className="book-image"
								src={`${apiurl}${book?.image}`}
								alt={book?.title}
								onError={(e) => {
									e.target.onerror = null;
									
								}}
							/>
						</div>
						<div className="book-info-container">
							<h1 className="book-title">{book?.title}</h1>
							<h3 className="book-author">Author: {book?.author}</h3>
							<p className="book-status">
								Copies Available: {book?.num_of_copies}
							</p>
							<pre className="book-description">{book?.description}</pre>
							<div className="book-actions">
								{isAddedToCart ? (
									<>
										<Button
											className="cart-button"
											onClick={() => updateCart("remove")}>
											Remove From Cart
										</Button>
										<Button
											className="go-cart-button"
											onClick={() => navigate("/cart")}>
											Go to cart
										</Button>
									</>
								) : (
									<Button
										className="cart-button"
										onClick={() => updateCart("add")}>
										Add to Cart
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="reviews-user">
					<h2>Reviews</h2>
					{comments.length > 0 ? (
						comments.map((comment) => (
							<div key={comment.id} className="review-item">
								<h4 className="review-username">{comment.userprofile}</h4>
								<div className="review-rating">
									{renderStars(comment.rating)}
								</div>
								<p className="review-comment">{comment.comment}</p>
							</div>
						))
					) : (
						<center>
							<p>No reviews yet.</p>
						</center>
					)}
				</div>
			</div>
		</Main>
	);
};

export default BookDetail;
