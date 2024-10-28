import React, { useEffect, useState } from "react";
import { Table, Input, Select, Space, Button, message, Popconfirm } from "antd";
import { useAuth } from "../utils/useAuth";
import Main from "./Layout";

const { Search } = Input;
const { Option } = Select;

const CommentList = () => {
	const [comments, setComments] = useState([]);
	const [groupedComments, setGroupedComments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [ratingFilter, setRatingFilter] = useState(null);
	const [enabledFilter, setEnabledFilter] = useState(null);
	const { apiurl, token } = useAuth();

	const fetchComments = async () => {
		try {
			const response = await fetch(`${apiurl}/reviews/`);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			setComments(data.data);
			groupByBook(data.data);
		} catch (err) {
			message.error("Failed to fetch comments");
		}
	};

	const groupByBook = (comments) => {
		const grouped = comments.reduce((acc, comment) => {
			const bookTitle = comment.book.title;
			if (!acc[bookTitle]) {
				acc[bookTitle] = [];
			}
			acc[bookTitle].push(comment);
			return acc;
		}, {});
		const groupedArray = Object.keys(grouped).map((title) => ({
			book: title,
			comments: grouped[title],
		}));
		setGroupedComments(groupedArray);
	};

	useEffect(() => {
		fetchComments();
	}, []);

	const handleSearch = (value) => {
		setSearchTerm(value);
		filterComments(value, ratingFilter, enabledFilter);
	};

	const filterComments = (search, rating, enabled) => {
		let filtered = [...comments];

		if (search) {
			filtered = filtered.filter(
				(comment) =>
					comment.user.username.toLowerCase().includes(search.toLowerCase()) ||
					comment.book.title.toLowerCase().includes(search.toLowerCase())
			);
		}

		if (rating) {
			filtered = filtered.filter((comment) => comment.rating === rating);
		}

		if (enabled !== null) {
			filtered = filtered.filter((comment) => comment.enabled === enabled);
		}

		groupByBook(filtered);
	};

	const handleRatingFilter = (value) => {
		setRatingFilter(value);
		filterComments(searchTerm, value, enabledFilter);
	};

	const handleEnabledFilter = (value) => {
		setEnabledFilter(value);
		filterComments(searchTerm, ratingFilter, value);
	};

	const handlePin = async (commentId, enabled) => {
		try {
			const response = await fetch(`${apiurl}/reviews/`, {
				method: "PUT",
				body: JSON.stringify({ enabled: !enabled, id: commentId }),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const updatedComments = comments.map((comment) =>
					comment.id === commentId ? { ...comment, enabled: !enabled } : comment
				);
				setComments(updatedComments);
				groupByBook(updatedComments);
				message.success(
					`Comment ${enabled ? "unpinned" : "pinned"} successfully`
				);
			} else {
				message.error("Failed to update comment");
			}
		} catch (error) {
			message.error("An error occurred while updating the comment");
		}
	};

	const handleDelete = async (commentId) => {
		try {
			const response = await fetch(`${apiurl}/reviews/`, {
				method: "DELETE",
				body: JSON.stringify({ id: commentId }),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const updatedComments = comments.filter(
					(comment) => comment.id !== commentId
				);
				setComments(updatedComments);
				groupByBook(updatedComments);
				message.success("Comment deleted successfully");
			} else {
				message.error("Failed to delete comment");
			}
		} catch (error) {
			message.error("An error occurred while deleting the comment");
		}
	};

	const expandedRowRender = (record) => {
		const columns = [
			{
				title: "User",
				dataIndex: "userprofile",
				key: "user",
			},
			{
				title: "Rating",
				dataIndex: "rating",
				key: "rating",
			},
			{
				title: "Comment",
				dataIndex: "comment",
				key: "comment",
			},
			{
				title: "Pined To Home",
				dataIndex: "enabled",
				key: "enabled",
				render: (enabled) => (enabled ? "Yes" : "No"),
			},
			{
				title: "Actions",
				key: "actions",
				render: (text, record) => (
					<Space>
						<Button
							type="primary"
							onClick={() => handlePin(record.id, record.enabled)}>
							{record.enabled ? "Unpin" : "Pin"}
						</Button>

						<Popconfirm
							title="Are you sure you want to delete this comment?"
							onConfirm={() => handleDelete(record.id)}
							okText="Yes"
							cancelText="No">
							<Button danger>Delete</Button>
						</Popconfirm>
					</Space>
				),
			},
		];

		return (
			<Table
				columns={columns}
				dataSource={record.comments}
				pagination={false}
				rowKey={(record) => record.id}
			/>
		);
	};

	const columns = [
		{
			title: "Book Title",
			dataIndex: "book",
			key: "book",
		},
	];

	return (
		<Main>
			<Space style={{ marginBottom: 16 }}>
				<Search
					placeholder="Search by user or book"
					onSearch={handleSearch}
					enterButton
				/>

				<Select
					placeholder="Filter by rating"
					style={{ width: 150 }}
					onChange={handleRatingFilter}
					allowClear>
					<Option value={1}>1 Star</Option>
					<Option value={2}>2 Stars</Option>
					<Option value={3}>3 Stars</Option>
					<Option value={4}>4 Stars</Option>
					<Option value={5}>5 Stars</Option>
				</Select>

				<Select
					placeholder="Filter by enabled status"
					style={{ width: 180 }}
					onChange={handleEnabledFilter}
					allowClear>
					<Option value={true}>Pinned</Option>
					<Option value={false}>Unpinned</Option>
				</Select>
			</Space>

			<Table
				columns={columns}
				dataSource={groupedComments}
				expandable={{
					expandedRowRender,
					rowExpandable: (record) => record.comments.length > 0,
				}}
				rowKey={(record) => record.book}
			/>
		</Main>
	);
};

export default CommentList;
