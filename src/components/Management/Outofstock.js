import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuth";
import { Link } from "react-router-dom";
import { Table, Input, Spin } from "antd";
import "./Inventory.css";

const { Search } = Input;

const OutOfStock = () => {
	const { apiurl, token } = useAuth();
	const [books, setBooks] = useState(null);
	const [filteredBooks, setFilteredBooks] = useState(null);
	const [loading, setLoading] = useState(false);

	const getBooks = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${apiurl}/books/outofstock/`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setBooks(data.data);
				setFilteredBooks(data.data);
			}
		} catch (error) {
			console.error("Error fetching books:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (value) => {
		if (!value) {
			setFilteredBooks(books);
		} else {
			const filtered = books.filter((book) =>
				book.title.toLowerCase().includes(value.toLowerCase())
			);
			setFilteredBooks(filtered);
		}
	};

	const columns = [
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
			render: (text, record) => (
				<Link to={`/inventory/book/${record.id}`}>{text}</Link>
			),
		},
		{
			title: "Author",
			dataIndex: "author",
			key: "author",
		},
		{
			title: "Available Copies",
			dataIndex: "num_of_copies",
			key: "num_of_copies",
		},
	];

	useEffect(() => {
		getBooks();
	}, []);

	return (
		<div className="inventory-container">
			<div className="searchContainer">
				<Search
					className="searchInput"
					placeholder="Search by title"
					onSearch={handleSearch}
					enterButton
					onChange={(e) => handleSearch(e.target.value)}
				/>
			</div>
			<Spin spinning={loading}>
				<div className="tableContainer">
					<Table
						columns={columns}
						dataSource={filteredBooks}
						rowKey={(record) => record.id}
						pagination={{ pageSize: 10 }}
						components={{
							header: {
								cell: (props) => <th {...props} className="tableHeader" />,
							},
						}}
					/>
				</div>
			</Spin>
		</div>
	);
};

export default OutOfStock;
