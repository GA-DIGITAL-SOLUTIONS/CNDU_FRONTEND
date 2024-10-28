import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/useAuth";
import { Table } from "antd";
import Main from "./Layout";

const Payments = () => {
	const { apiurl, token } = useAuth();
	const [data, setData] = useState([]);
	useEffect(() => {
		fetchDetails();
	}, []);
	const columns = [
		{
			title: "User Name",
			dataIndex: "user",
			key: "user",
		},
		{
			title: "Payment Date",
			dataIndex: "date",
			key: "date",
		},
		{
			title: "Amount",
			dataIndex: "amount",
			key: "amount",
		},
		{
			title: "Transaction Id",
			dataIndex: "transactionId",
			key: "transactionId",
		},
		{
			title: "Plan",
			dataIndex: "plan",
			key: "plan",
		},
	];

	const fetchDetails = async () => {
		try {
			const response = await fetch(`${apiurl}/payments/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			setData(data);
		} catch (error) {
			console.error("Error:", error);
		}
	};
	return (
		<Main>
			<div className="books-with-users-main">
				<Table
					bordered={false}
					components={{
						header: {
							cell: (props) => <th {...props} className="tableHeader" />,
						},
					}}
					dataSource={data}
					columns={columns}></Table>
			</div>
		</Main>
	);
};

export default Payments;
