import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Image } from "antd";
import { fetchCombinationById } from "../../../store/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import "./AdminSpecificComboPage.css";
import { Link } from "react-router-dom";
import Main from "../AdminLayout/AdminLayout";
const AdminSpecificCombopage = () => {
	const dispatch = useDispatch();
	const { apiurl } = useSelector((state) => state.auth);
	const { singlecombination } = useSelector((state) => state.products);

	const { id } = useParams();

	useEffect(() => {
		if (id) {
			dispatch(fetchCombinationById({ apiurl, id }));
		}
	}, [dispatch, apiurl, id]);

	console.log("items", singlecombination?.items);

	const result =
		singlecombination?.items?.map(({ item }, index) => {
			const firstColor = item.product_colors[0]?.color?.name || "No color";
			const itemname = item.product_colors[0]?.product || "No name";
			const firstImage = item.product_colors[0]?.images[0]?.image || "No image";
			console.log("iiiiii", item);
			const id = item.id;
			const type = item.type;
			return {
				key: index,
				firstColor,
				firstImage,
				itemname,
				price: "200-300",
				id,
				type,
			};
		}) || [];

	console.log(result);

	const columns = [
		{
			dataIndex: "firstImage",
			key: "firstImage",
			render: (image, record) => {
				console.log("record",record)
				return (
					<div style={{ width: "200px" }}>
						<Link to={`/inventory/product/${record.id}`}>
							<Image src={`${apiurl}${image}`} alt="Product" width={80} />
						</Link>
					</div>
				)
			}
		},
		{
			dataIndex: "itemname",
			key: "itemname",
			render: (text, record) => {
				return (
					<div style={{ width: "200px" }}>
						<Link to={`/inventory/product/${record.id}`}>
						<strong>{record.itemname}</strong>
						</Link>
						<br />
						<span style={{ color: "#888" }}>{record.firstColor}</span>
						<span style={{ color: "#888" }}>{record.id}</span>
					</div>
				)
			}
		},
		{
			dataIndex: "price",
			key: "price",
		},
	];

	return (
		<Main>
			<div className="singlecombination_container">
				{singlecombination ? (
					<>
						<div className="singlecombination_image">
							<h1>{singlecombination.combination_name}</h1>
							<img
								style={{ width: "350px" }}
								src={`${apiurl}${singlecombination.images?.[0]?.image}`}
								alt={singlecombination.combination_name}
							/>
						</div>
						<div className="Combination_items">
							<Table
								className="Combination_items_table"
								style={{ height: "100%", margin: "0 auto" }}
								dataSource={result}
								columns={columns}
								pagination={false}
								width={50}
							/>
						</div>
					</>
				) : (
					<p>Loading combination details...</p>
				)}
			</div>
		</Main>
	);
};

export default AdminSpecificCombopage;
