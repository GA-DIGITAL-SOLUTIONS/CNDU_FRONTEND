import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuth";
import { useNavigate } from "react-router-dom";
import { Button, List } from "antd";
import Main from "./Layout";
import "./Books.css";


const MyBooks = () => {
	const navigate = useNavigate();
	const { apiurl, token } = useAuth();
	const [wishlist, setWishlist] = useState([]);

	const getWishlist = async () => {
		try {
			const response = await fetch(`${apiurl}/mybooks/`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setWishlist(data.user_books);
			}
		} catch (error) {
			console.error("Error fetching wishlist:", error);
		}
	};

	useEffect(() => {
		getWishlist();
	}, []);

	const renderBookActions = (bookId) => (
		<>
			<Button type="link" onClick={() => navigate(`/catalogue/${bookId}`)}>
				View Book
			</Button>
		</>
	);

	return (
		<Main>
			<div className="book-container">
				<List
					itemLayout="vertical"
					dataSource={wishlist}
					renderItem={(item) => (
						<List.Item
							actions={[renderBookActions(item.book.id)]}
							className="book-list-item">
							<div className="book-list-content">
								<img
									src={`${apiurl}${item.book.image}`}
									alt={item.book.title}
									className="book-list-image"
									onClick={() => navigate(`/catalogue/${item.book.id}`)}
								/>
								<div className="book-list-details">
									<div className="book-list-title">{item.book.title}</div>
									<div className="book-list-description">
										<div>
											<strong>Author:</strong> {item.book.author}
										</div>
										<div>
											<strong>Category:</strong> {item.book.category}
										</div>
										<div className="desc">
											{item.book.description.slice(0, 250)}
											{"..."}
										</div>
									</div>
								</div>
							</div>
						</List.Item>
					)}
				/>
			</div>
		</Main>
	);
};

export default MyBooks;
