import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Tag, Select, message } from "antd";
import { useSelector } from "react-redux";
import Main from "./AdminLayout/AdminLayout";
const { Option } = Select;

const ReviewsComponent = () => {
	const [reviews, setReviews] = useState([]);
	const [filteredReviews, setFilteredReviews] = useState([]);
	const [statusFilter, setStatusFilter] = useState(null);
	const [loading, setLoading] = useState(false);
	const [selectedReview, setSelectedReview] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { apiurl, access_token } = useSelector((state) => state.auth);

	const fetchReviews = async () => {
		
		setLoading(true);
		try {
			const response = await fetch(`${apiurl}/reviews`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${access_token}`,
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			setReviews(data);
			setFilteredReviews(data);
		} catch (error) {
			message.error("Failed to fetch reviews.");
		} finally {
			setLoading(false);
		}
	};



	const updateReviewStatus = async (id, status) => {
		try {
			const response = await fetch(
				`${apiurl}/reviews/update?id=${id}&status=${status}`,
				{
					method: "PUT",
				}
			);
			if (response.ok) {
				message.success(`Review status updated to ${status}.`);
				fetchReviews();
			} else {
				throw new Error("Failed to update review status.");
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	const handleFilterChange = (value) => {
		setStatusFilter(value);
		if (value) {
			setFilteredReviews(reviews.filter((review) => review.status === value));
		} else {
			setFilteredReviews(reviews);
		}
	};

	const openModal = (review) => {
		setSelectedReview(review);
		setIsModalVisible(true);
	};

	const closeModal = () => {
		setSelectedReview(null);
		setIsModalVisible(false);
	};

	const handleStatusChange = (status) => {
		if (selectedReview) {
			updateReviewStatus(selectedReview.id, status);
			closeModal();
		}
	};

	useEffect(() => {
		fetchReviews();
	}, []);

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "User",
			dataIndex: "user",
			key: "user",
		},
		{
			title: "Rating",
			dataIndex: "rating",
			key: "rating",
		},
		{
			title: "Review",
			dataIndex: "review",
			key: "review",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status) =>
				status === "approved" ? (
					<Tag color="green">Approved</Tag>
				) : status === "rejected" ? (
					<Tag color="red">Rejected</Tag>
				) : (
					<Tag color="orange">Pending</Tag>
				),
		},
		{
			title: "Actions",
			key: "actions",
			render: (_, record) => (
				<Button type="link" onClick={() => openModal(record)}>
					Update Status
				</Button>
			),
		},
	];

	return (
		<Main>
			<Select
				placeholder="Filter by status"
				style={{ width: 200, marginBottom: 16 }}
				onChange={handleFilterChange}
				allowClear>
				<Option value="approved">Approved</Option>
				<Option value="rejected">Rejected</Option>
			</Select>
			<Table
				dataSource={filteredReviews}
				columns={columns}
				rowKey="id"
				loading={loading}
			/>
			<Modal
				title="Update Review Status"
				visible={isModalVisible}
				onCancel={closeModal}
				footer={[
					<Button key="back" onClick={closeModal}>
						Cancel
					</Button>,
					<Button
						key="approve"
						type="primary"
						onClick={() => handleStatusChange("approved")}>
						Approve
					</Button>,
					<Button
						key="reject"
						type="danger"
						onClick={() => handleStatusChange("rejected")}>
						Reject
					</Button>,
				]}>
				{selectedReview && (
					<div>
						<p>
							<strong>Review ID:</strong> {selectedReview.id}
						</p>
						<p>
							<strong>User:</strong> {selectedReview.user}
						</p>
						<p>
							<strong>Rating:</strong> {selectedReview.rating}
						</p>
						<p>
							<strong>Review:</strong> {selectedReview.review}
						</p>
					</div>
				)}
			</Modal>
		</Main>
	);
};

export default ReviewsComponent;
