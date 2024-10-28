import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuth";
import { useNavigate } from "react-router-dom";
import { Button, message, Radio, Input, Pagination, Drawer } from "antd";
import { HeartOutlined, HeartFilled, FilterOutlined } from "@ant-design/icons";
import "./Books.css";

const { Search } = Input;

const Books = () => {
	const navigate = useNavigate();
	const { apiurl, token } = useAuth();
	const [books, setBooks] = useState([]);
	const [filteredBooks, setFilteredBooks] = useState([]);
	const [wishlist, setWishlist] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalBooks, setTotalBooks] = useState(0);
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);

	const fetchBooks = async () => {
		try {
			const response = await fetch(`${apiurl}/books/`);
			if (!response.ok) throw new Error(`Error: ${response.statusText}`);
			const data = await response.json();
			setBooks(data.data);
			setTotalBooks(data.data.length);
			handleFilterAndSearch(data.data, currentPage, pageSize);
		} catch (error) {
			message.error("Error fetching books.");
			console.error("Error fetching books:", error);
		}
	};

	const fetchWishlist = async () => {
		try {
			const response = await fetch(`${apiurl}/wishlist/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) throw new Error(`Error: ${response.statusText}`);
			const data = await response.json();
			setWishlist(data.data);
		} catch (error) {
			console.error("Error fetching wishlist:", error);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await fetch(`${apiurl}/getcategories/`, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setCategories(data.data.map((category) => category.name));
			} else {
				console.error("Failed to fetch categories:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	useEffect(() => {
		fetchBooks();
		fetchWishlist();
		fetchCategories();
	}, []);

	useEffect(() => {
		handleFilterAndSearch(books, currentPage, pageSize);
	}, [selectedCategory, currentPage, pageSize]);

	const isWishlisted = (bookId) =>
		wishlist.some((item) => item.book.id === bookId);

	const toggleWishlist = async (bookId) => {
		const wishlisted = isWishlisted(bookId);
		const method = wishlisted ? "DELETE" : "POST";

		if (!token) {
			return message.error("Please login to wishlist books.");
		}

		try {
			const response = await fetch(`${apiurl}/wishlist/`, {
				method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: bookId }),
			});

			const data = await response.json();
			if (response.ok) {
				message.success(data.message);
				fetchWishlist();
			} else {
				message.error(data.error);
			}
		} catch (error) {
			message.error("Error toggling wishlist.");
			console.error("Error toggling wishlist:", error);
		}
	};

	const handleCategoryChange = (e) => {
		setSelectedCategory(e.target.value);
		setCurrentPage(1);
	};

	const handleSearch = (value) => {
		const filtered = books.filter(
			(book) =>
				book.title.toLowerCase().includes(value.toLowerCase()) ||
				book.author.toLowerCase().includes(value.toLowerCase()) ||
				(book.categories &&
					book.categories.some((cat) =>
						cat.name.toLowerCase().includes(value.toLowerCase())
					))
		);
		handleFilterAndSearch(filtered, 1, pageSize);
		setCurrentPage(1);
	};

	const handlePageChange = (page, pageSize) => {
		setCurrentPage(page);
		setPageSize(pageSize);
		handleFilterAndSearch(books, page, pageSize);
	};

	const handleFilterAndSearch = (booksList, currentPage, pageSize) => {
		let filtered = booksList || books;

		if (selectedCategory) {
			filtered = filtered.filter(
				(book) =>
					book.categories &&
					book.categories.some((cat) => cat.name === selectedCategory)
			);
		}

		const start = (currentPage - 1) * pageSize;
		const end = start + pageSize;
		setFilteredBooks(filtered.slice(start, end));
		setTotalBooks(filtered.length);
	};

	const renderBookActions = (bookId) => (
		<>
			<Button onClick={() => navigate(`/catalogue/${bookId}`)}>
				View Book
			</Button>
			<Button
				type="primary"
				icon={isWishlisted(bookId) ? <HeartFilled /> : <HeartOutlined />}
				onClick={() => toggleWishlist(bookId)}
			/>
		</>
	);

	// Open and close Drawer for filters on mobile
	const showDrawer = () => {
		setIsDrawerVisible(true);
	};

	const closeDrawer = () => {
		setIsDrawerVisible(false);
	};

	return (
		<div className="books-container">
			<div className="mobile-filter-btn">
				<Button icon={<FilterOutlined />} onClick={showDrawer}>
					Apply Filter
				</Button>
			</div>

			<Drawer
				title="Filters"
				placement="left"
				onClose={closeDrawer}
				visible={isDrawerVisible}
				className="filters-drawer"
				width={250}>
				<Search placeholder="Search books" onSearch={handleSearch} />
				<h3>Filter By Category</h3>
				<Radio.Group
					onChange={handleCategoryChange}
					value={selectedCategory}
					className="filters">
					<Radio value="" className="filter">
						All
					</Radio>
					{categories.map((category) => (
						<Radio key={category} className="filter" value={category}>
							{category
								.replace(/_/g, " ")
								.replace(/\b\w/g, (char) => char.toUpperCase())}
						</Radio>
					))}
				</Radio.Group>
			</Drawer>

			<div className="book-list">
				<div className="book-grid">
					{filteredBooks.map((book) => (
						<div key={book.id} className="book-item">
							<div className="book-image">
								<img src={`${apiurl}${book.image}`} alt={book.title} />
							</div>
							<div className="book-details">
								<div>
									<div className="book-title">
										{book.title.length > 30
											? `${book.title.slice(0, 30)}...`
											: book.title}
									</div>
									<div className="book-author">By {book.author}</div>
									<div className="desc">
										{book.description.slice(0, 120)}...
									</div>
								</div>
								<div className="book-actions">{renderBookActions(book.id)}</div>
							</div>
						</div>
					))}
				</div>
				<Pagination
					className="book-pagination"
					current={currentPage}
					pageSize={pageSize}
					total={totalBooks}
					onChange={handlePageChange}
					showSizeChanger
					pageSizeOptions={["10", "20", "50"]}
				/>
			</div>
		</div>
	);
};

export default Books;
