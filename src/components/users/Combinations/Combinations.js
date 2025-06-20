import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Pagination } from "antd";

import "./Combination.css";
import Loader from "../../Loader/Loader";
import { Link } from "react-router-dom";

const Combinations = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({
		count: 0,
		next: null,
		previous: null,
	});
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9;
	const { apiurl } = useSelector((state) => state.auth);

	useEffect(() => {
		const fetchPaginatedCombinations = async () => {
			setLoading(true);
			try {
				const params = new URLSearchParams({
					page: currentPage,
					page_size: pageSize,
				});
				const response = await axios.get(`${apiurl}/paginated/combinations/`, { params });
				setProducts(response.data.results);
				setPagination({
					count: response.data.count,
					next: response.data.next,
					previous: response.data.previous,
				});
				setLoading(false);
			} catch (error) {
				console.error("Error fetching paginated combinations:", error);
				setLoading(false);
			}
		};
		fetchPaginatedCombinations();
	}, [currentPage, apiurl]);

	useEffect(() => {
		window.scrollTo(10, 10);
	}, [currentPage]);

	const displayedProducts = products;

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	return (
		<div className="products-page" style={{ position: "relative" }}>
			{loading && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100vh",
						backgroundColor: "white",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 9999,
					}}>
					<Loader />
				</div>
			)}
			<div className="products-container">
				{displayedProducts.length === 0 ? (
					<div className="no-products">
						<h1>No matching combinations found.</h1>
					</div>
				) : (
					<>
						<div className="combination-cards-container">
							{displayedProducts?.map((comb) => {
								const firstImage = comb.images?.[0]?.image;
								return (
									<div key={comb.id} className="combination-card">
										{firstImage ? (
											<Link to={`/combinations/${comb.id}`}>
												<img
													className="combination-card-image"
													src={`${firstImage}`}
													alt={comb.combination_name}
												/>
											</Link>
										) : (
											<div className="combination-card-placeholder">
												<p>No image available</p>
											</div>
										)}
										<div className="combination-card-details">
											<h2 className="combination-card-title">
												<Link to={`/combinations/${comb.id}`}>
													{comb.combination_name}
												</Link>
											</h2>
										</div>
									</div>
								);
							})}
						</div>
						<Pagination
							current={currentPage}
							pageSize={pageSize}
							total={pagination.count}
							onChange={handlePageChange}
							showSizeChanger={false}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default Combinations;
