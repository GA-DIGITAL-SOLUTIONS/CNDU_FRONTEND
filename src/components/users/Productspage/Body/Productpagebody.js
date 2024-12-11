import React, { useEffect, useState } from "react";
import { Slider, Card, Row, Col, Button, Pagination } from "antd";
import "./Productpagebody.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchSarees } from "../../../../store/productsSlice";
import Specialdealscard from "../../cards/Specialdealscard";
import { Link } from "react-router-dom";
import Heading from "../../Heading/Heading";

const { Meta } = Card;

const Productpagebody = () => {
	const [priceRange, setPriceRange] = useState([0, 20000]);
	const [selectedColor, setSelectedColor] = useState(null);
	const [priceExpanded, setPriceExpanded] = useState(false);
	const [Filters, setFilters] = useState(false);

	const [colorExpanded, setColorExpanded] = useState(false);

	const [filter, setFilter] = useState(false);
	const [filteredProducts, setFilteredProducts] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchSarees());
		dispatch(fetchProducts());
	}, [dispatch]);

	const { sarees } = useSelector((store) => store.products);
	const { apiurl } = useSelector((state) => state.auth);

	console.log("F", sarees, "products");
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9;

	const handlePriceChange = (value) => {
		setPriceRange(value);
		handleFilters();
	};

	const handleColorClick = (color) => {
		console.log("selected color ", color);
		setSelectedColor(color);
	};
	useEffect(() => {
		if (selectedColor != null) {
			handleFilters();
		}
	}, [selectedColor]);

	console.log("filter", filter);

	const togglePrice = () => {
		setPriceExpanded(!priceExpanded);
	};

	const togglefilters = () => {
		setFilters(!Filters);
	};

	const toggleColor = () => {
		setColorExpanded(!colorExpanded);
	};

	const handleFilters = () => {
		console.log("Selected filters:", priceRange, selectedColor);
		console.log("Filtering based on product_colors -> price and color.name");

		const filtered = sarees.filter((product) => {
			const colorPriceMatch = product.product_colors?.some((colorObj) => {
				const colorMatch = selectedColor
					? colorObj.color.name.toLowerCase() === selectedColor.toLowerCase()
					: true;
				const priceMatch =
					colorObj.price >= priceRange[0] && colorObj.price <= priceRange[1];

				return colorMatch && priceMatch;
			});

			return colorPriceMatch;
		});

		console.log("Filtered Products:", filtered);
		setFilteredProducts(filtered);
		setFilter(true);
		setCurrentPage(1);
	};

	const totalProducts = filter ? filteredProducts.length : sarees.length;
	const totalPages = Math.ceil(totalProducts / pageSize);

	const displayedProducts = (filter ? filteredProducts : sarees)?.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	console.log("Total Products:", totalProducts);
	console.log("Total Pages:", totalPages);

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const [activeKey, setActiveKey] = useState(["1"]);

	const productColors = sarees.map((product) => {
		return product.product_colors;
	});
	console.log("productColors", productColors);

	const allColors = productColors.flatMap((Pcobj) =>
		Pcobj.map((singlcolor) => singlcolor.color)
	);

	const uniqueColors = allColors.filter(
		(color, idx, self) =>
			self.findIndex(
				(c) => c.name.toLowerCase() === color.name.toLowerCase()
			) === idx
	);

	return (
		<div className="products-page">
			<img
				src="./productpageBanner.png"
				className="productpageBanner"
				alt="Product Page Banner"
			/>
			<div className="filter-products-container">
				<div className="filter-container">
					<div className="filter">
						<div className="first-div">
							<b>
								<h5>Filter Options</h5>
							</b>
							<img
								src="./filter.png"
								style={{ cursor: "pointer" }}
								alt="filter-icon"
								onClick={togglefilters}
							/>
						</div>

						<div className="price-div">
							<b>
								<h5>Price</h5>
							</b>
						</div>

						{Filters && (
							<div className="price-content">
								<Slider
									className="custom-slider"
									range
									min={0}
									max={20000}
									step={50}
									trackStyle={{
										borderColor: "#000",
										backgroundColor: "#fff",
									}}
									value={priceRange}
									onChange={handlePriceChange}
								/>
								<p>
									Range: Rs {priceRange[0]} - Rs {priceRange[1]}
								</p>
							</div>
						)}

						<div className="color-div">
							<b>
								<h5>Colors</h5>
							</b>
						</div>

						{Filters && (
							<div className="color-content">
								{uniqueColors.map((color) => (
									<div
										key={color?.name}
										className="color-box"
										style={{
											backgroundColor: color?.name.toLowerCase(),
											border:
												selectedColor === color?.name
													? "2px solid pink"
													: "1px solid #ddd",
											width: "40px",
											height: "40px",
											borderRadius: "30px",
											cursor: "pointer",
										}}
										onClick={() => handleColorClick(color?.name)}></div>
								))}
							</div>
						)}
					</div>
					<img src="./Maryqueen.png" className="Maryqueen" alt="filter"></img>
				</div>

				<div className="products-container">
					<div className="products-main-cont">
						{displayedProducts?.map((product) => {
							const firstColorImage =
								product.product_colors?.[0]?.images?.[0]?.image ||
								product.image;
							const firstPrice = product.product_colors?.[0]?.price;
							return (
								<>
									<Card
										className="product-item"
										cover={
											<Link to={`/products/${product.id}`}>
												<img
													alt={product.name}
													src={`${apiurl}${firstColorImage}`}
													style={{
														cursor: "pointer",
														width: "100%",
														borderRadius: "10px",
														objectFit: "cover",
													}}
												/>
											</Link>
										}>
										<div className="product-info">
											<Meta
												title={
													<Link
														to={`/products/${product.id}`}
														style={{
															color: "inherit",
															textDecoration: "none",
															display: "inline-block",
															whiteSpace: "nowrap",
															overflow: "hidden",
															textOverflow: "ellipsis",
															maxWidth: "240px",
														}}>
														{product.name.substring(0,50)}
													</Link>
												}
												description="In stock"
											/>
										</div>
										<Button
											type="primary"
											style={{
												width: "45%",
												backgroundColor: "#F6F6F6",
												color: "#3C4242",
											}}>
											Rs: {firstPrice}
										</Button>
									</Card>
								</>
							);
						})}
					</div>

					<Pagination
						current={currentPage}
						total={totalProducts}
						pageSize={pageSize}
						onChange={(page) => setCurrentPage(page)}
						className="custom-pagination"
						style={{ marginTop: "20px", marginBottom: "20px" }}
						itemRender={(page, type, originalElement) => {
							if (type === "prev") {
								return (
									<img
										src="/Paginationleftarrow.svg"
										alt="Previous"
										style={{ width: "20px" }}
									/>
								);
							}
							if (type === "next") {
								return (
									<img
										src="/Paginationrightarrow.svg"
										alt="Next"
										style={{ width: "20px" }}
									/>
								);
							}
							return originalElement;
						}}
					/>
				</div>
			</div>
			<Specialdealscard></Specialdealscard>
		</div>
	);
};

export default Productpagebody;
