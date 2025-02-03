import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/useAuth";
import { Table  } from "antd";

const BooksWithUsers = () => {
	const { apiurl, token } = useAuth();
	const [data, setData] = useState([]);
	useEffect(() => {
		fetchDetails();
	}, []);
	const columns = [
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
		},

		{
			title: "User Name",
			dataIndex: "user",
			key: "user",
		},

		{
			title: "Rent Date",
			dataIndex: "rent_date",
			key: "rent_date",
		},

		{
			title: "Status",
			dataIndex: "status",
			key: "status",
		},
	];

	const fetchDetails = async () => {
		try {
			// console.log({ apiurl });
			const response = await fetch(`${apiurl}/getbooks/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			// console.log(data);
			const transformedData = data.books.map((book) => ({
				key: book.id,
				title: book.book.title,
				author: book.book.author,
				rent_date: book.rent_date,
				status: book.status,
				user: book.user,
			}));

			setData(transformedData);
		} catch (error) {
			console.error("Error:", error);
		}
	};
	return (
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
	);
};

export default BooksWithUsers;
