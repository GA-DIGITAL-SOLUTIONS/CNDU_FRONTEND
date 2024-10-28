import React, { useState, useEffect } from "react";
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	DatePicker,
	notification,
} from "antd";
import { useAuth } from "../utils/useAuth";
import Main from "./Layout";


const { Column } = Table;



const CouponCodeManager = () => {
	const [couponCodes, setCouponCodes] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
    const {apiurl,token} = useAuth();


	useEffect(() => {
		fetchCouponCodes();
	}, []);

	const fetchCouponCodes = async () => {
		try {
			const response = await fetch(`${apiurl}/coupon-code/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) throw new Error("Network response was not ok");
			const data = await response.json();
			setCouponCodes(data.data);
		} catch (error) {
			notification.error({
				message: "Error",
				description: "Failed to fetch coupon codes.",
			});
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await fetch(`${apiurl}/coupon-code/`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ id: id }),
			});
			if (!response.ok) throw new Error("Network response was not ok");
			fetchCouponCodes();
			notification.success({
				message: "Success",
				description: "Coupon code deleted successfully.",
			});
		} catch (error) {
			notification.error({
				message: "Error",
				description: "Failed to delete coupon code.",
			});
		}
	};

	const handleAddNew = () => {
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields();
			const { code, amount, start_date, end_date } = values;
			const response = await fetch(`${apiurl}/coupon-code/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					code,
					amount,
					start_date,
					end_date,
				}),
			});
			if (!response.ok) throw new Error("Network response was not ok");
			setIsModalVisible(false);
			fetchCouponCodes();
			notification.success({
				message: "Success",
				description: "Coupon code created successfully.",
			});
		} catch (error) {
			notification.error({
				message: "Error",
				description: "Failed to create coupon code.",
			});
		}
	};

	const handleModalCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<>
			<Button
				type="primary"
				onClick={handleAddNew}
				style={{ marginBottom: 16 }}
				className="offerManager-addButton">
				Add New
			</Button>
			<Table
				dataSource={couponCodes}
				rowKey="id"
				className="offerManager-table"
				components={{
					header: {
						cell: (props) => <th {...props} className="tableHeader" />,
					},
				}}>
				<Column title="Code" dataIndex="code" key="code" />
				<Column title="Amount" dataIndex="amount" key="amount" />
				<Column
					title="Start Date"
					dataIndex="start_date"
					key="start_date"
					render={(date) => new Date(date).toLocaleDateString()}
				/>
				<Column
					title="End Date"
					dataIndex="end_date"
					key="end_date"
					render={(date) => new Date(date).toLocaleDateString()}
				/>
				<Column
					title="Action"
					key="action"
					render={(text, record) => (
						<Button
							type="link"
							danger
							className="offerManager-deleteButton"
							onClick={() => handleDelete(record.id)}>
							Delete
						</Button>
					)}
				/>
			</Table>
			<Modal
				title="Add New Coupon Code"
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
				okText="Add"
				cancelText="Cancel"
				className="offerManager-modal">
				<Form form={form} layout="vertical" className="offerManager-form">
					<Form.Item
						name="code"
						label="Code"
						rules={[
							{ required: true, message: "Please input the coupon code!" },
						]}
						className="offerManager-formItem">
						<Input />
					</Form.Item>
					<Form.Item
						name="amount"
						label="Amount"
						className="offerManager-formItem"
						rules={[{ required: true, message: "Please input the amount!" }]}>
						<Input type="number" />
					</Form.Item>
					<Form.Item
						name="start_date"
						label="Start Date"
						className="offerManager-formItem"
						rules={[
							{ required: true, message: "Please select the start date!" },
						]}>
						<Input type="date" />
					</Form.Item>
					<Form.Item
						name="end_date"
						label="End Date"
						className="offerManager-formItem"
						rules={[
							{ required: true, message: "Please select the end date!" },
						]}>
						<Input type="date" />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default CouponCodeManager;
