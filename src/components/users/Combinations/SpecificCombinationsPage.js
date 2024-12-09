import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Table, Image } from "antd";
import { fetchCombinationById } from "../../../store/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import "./SpecificCombinationsPage.css";

const SpecificCombinationsPage = () => {
	const dispatch = useDispatch();
	const { apiurl } = useSelector((state) => state.auth);
	const { singlecombination } = useSelector((state) => state.products);

	const { id } = useParams();

	useEffect(() => {
		if (id) {
			dispatch(fetchCombinationById({ apiurl, id }));
		}
	}, [dispatch, apiurl, id]);

	const result =
		singlecombination?.items?.map(({ item }, index) => {
			const firstColor = item.product_colors[0]?.color?.name || "No color";
			const itemname = item.product_colors[0]?.product || "No name";
			const firstImage = item.product_colors[0]?.images[0]?.image || "No image";

			const id = item.id;
			const type = item.type;

			const prices = item.product_colors.map((pc) => Number(pc.price) || 0);
			const minPrice = Math.min(...prices);
			const price = `${minPrice}`;

			return {
				key: index,
				firstColor,
				firstImage,
				itemname,
				price,
				id,
				type,
			};
		}) || [];

	const minPrice =
		singlecombination?.items
			?.flatMap((item) =>
				item.item.product_colors.map((pc) => Number(pc.price) || Infinity)
			)
			.reduce((min, price) => Math.min(min, price), Infinity) || 0;

	const totalPrice =
		singlecombination?.items
			?.flatMap((item) =>
				item.item.product_colors.map((pc) => Number(pc.price) || 0)
			)
			.reduce((sum, price) => sum + price, 0) || 0;

	const columns = [
		{
			title: "Image",
			dataIndex: "firstImage",
			key: "firstImage",
			render: (image, record) => (
				<Image src={`${apiurl}${image}`} alt="Product" width={80} />
			),
		},
		{
			title: "Details",
			dataIndex: "itemname",
			key: "itemname",
			render: (text, record) => (
				<div>
					<strong>{record.itemname}</strong>
				</div>
			),
		},
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
			render: (text, record) => (
				<div>
					<strong>
						₹{record.price}/- Per {record.type === "product" ? "unit" : "meter"}
					</strong>
				</div>
			),
		},
	];

	return (
		<div className="singlecombination_container">
			{singlecombination ? (
				<div className="singlecombination_content">
					<div className="singlecombination_left">
						<div className="singlecombination_image">
							<img
								src={`${apiurl}${singlecombination.images?.[0]?.image}`}
								alt={singlecombination.combination_name}
							/>
						</div>
					</div>
					<div className="singlecombination_table">
						<div className="singlecombination_details">
							<h1>{singlecombination.combination_name}</h1>
							<p>
								{singlecombination.description || "No description available"}
							</p>
							<h3>
								Price Range: ₹{minPrice} - ₹{totalPrice}
							</h3>
						</div>
						<Table
							showHeader={false}
							className="Combination_items_table"
							dataSource={result}
							columns={columns}
							pagination={false}
							onRow={(record) => ({
								onClick: () => {
									window.location.href = `/${record.type}s/${record.id}`;
								},
								style: { cursor: "pointer" },
							})}
						/>
					</div>
				</div>
			) : (
				<p>Loading combination details...</p>
			)}
		</div>
	);
};

export default SpecificCombinationsPage;
