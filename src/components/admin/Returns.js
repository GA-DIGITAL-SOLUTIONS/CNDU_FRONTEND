import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Select, message, Tag } from "antd";
import { useSelector } from "react-redux";
import Main from "./AdminLayout/AdminLayout";
const { Option } = Select;

const ReturnsComponent = () => {
	const [returns, setReturns] = useState([]);
	const [filteredReturns, setFilteredReturns] = useState([]);
	const [statusFilter, setStatusFilter] = useState(null);
	const [loading, setLoading] = useState(false);
	const [selectedReturn, setSelectedReturn] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { apiurl, access_token } = useSelector((state) => state.auth);

	const fetchReturns = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${apiurl}/returns`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${access_token}`,
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			setReturns(data);
			setFilteredReturns(data);
		} catch (error) {
			message.error("Failed to fetch returns.");
		} finally {
			setLoading(false);
		}
	};

	const updateReturnStatus = async (id, status) => {
		try {
			const response = await fetch(`${apiurl}/returns`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ pk: id, status }),
			});
			if (response.ok) {
				message.success(`Return status updated to ${status}.`);
				fetchReturns();
			} else {
				throw new Error("Failed to update return status.");
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	const handleFilterChange = (value) => {
		setStatusFilter(value);
		if (value) {
			setFilteredReturns(returns.filter((ret) => ret.status === value));
		} else {
			setFilteredReturns(returns);
		}
	};

	const openModal = (ret) => {
		setSelectedReturn(ret);
		setIsModalVisible(true);
	};

	const closeModal = () => {
		setSelectedReturn(null);
		setIsModalVisible(false);
	};

	const handleStatusChange = (status) => {
		if (selectedReturn) {
			updateReturnStatus(selectedReturn.id, status);
			closeModal();
		}
	};

	useEffect(() => {
		fetchReturns();
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
			title: "Order Item",
			dataIndex: "order_item",
			key: "order_item",
		},
		{
			title: "Reason",
			dataIndex: "reason",
			key: "reason",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status) =>
				status === "accepted" ? (
					<Tag color="green">Accepted</Tag>
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
				<Option value="accepted">Accepted</Option>
				<Option value="rejected">Rejected</Option>
				<Option value="pending">Pending</Option>
			</Select>
			<Table
				dataSource={filteredReturns}
				columns={columns}
				rowKey="id"
				loading={loading}
			/>
			<Modal
				title="Update Return Status"
				open={isModalVisible}
				onCancel={closeModal}
				footer={[
					<Button key="back" onClick={closeModal}>
						Cancel
					</Button>,
					<Button
						key="accept"
						type="primary"
						onClick={() => handleStatusChange("accepted")}>
						Accept
					</Button>,
					<Button
						key="reject"
						type="danger"
						onClick={() => handleStatusChange("rejected")}>
						Reject
					</Button>,
				]}>
				{selectedReturn && (
					<div>
						<p>
							<strong>Return ID:</strong> {selectedReturn.id}
						</p>
						<p>
							<strong>User:</strong> {selectedReturn.user}
						</p>
						<p>
							<strong>Order Item:</strong> {selectedReturn.order_item}
						</p>
						<p>
							<strong>Reason:</strong> {selectedReturn.reason}
						</p>
					</div>
				)}
			</Modal>
		</Main>
	);
};

export default ReturnsComponent;
