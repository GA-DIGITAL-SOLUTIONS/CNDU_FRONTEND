import React, { useEffect, useState } from "react";
import { Slider, Card, Row, Col, Button, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../store/productsSlice";
import Specialdealscard from "../cards/Specialdealscard";
import Heading from "../Heading/Heading";

import { Link } from "react-router-dom";

const { Meta } = Card;

const SearchComponent = () => {
	const [priceRange, setPriceRange] = useState([0, 2000000]);
	const [selectedColor, setSelectedColor] = useState(null);
	const [priceExpanded, setPriceExpanded] = useState(false);
	const [colorExpanded, setColorExpanded] = useState(false);

	const [filter, setFilter] = useState(false);
	const [filteredProducts, setFilteredProducts] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	const { products, loading, error } = useSelector((store) => store.products);
	const { apiurl } = useSelector((state) => state.auth);

	const Fabrics = products.filter((product) => {
		return product.category.name === "Fabrics";
	});

	console.log("p", products);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9;

	const handlePriceChange = (value) => {
		setPriceRange(value);
		console.log("Selected Price Range:", value);
	};

	const handleColorClick = (color) => {
		setSelectedColor(color);
		console.log("Selected Color:", color);
	};

	const togglePrice = () => {
		setPriceExpanded(!priceExpanded);
	};

	const toggleColor = () => {
		setColorExpanded(!colorExpanded);
	};

	const handleFilters = () => {
		console.log("Selected filters:", priceRange, selectedColor);
		console.log("Filtering based on product_colors -> price and color.name");

		const filtered = Fabrics.filter((product) => {
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

	const totalProducts = filter ? filteredProducts.length : Fabrics.length;
	const totalPages = Math.ceil(totalProducts / pageSize);

	const displayedProducts = (filter ? filteredProducts : Fabrics)?.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	console.log("Total Products:", totalProducts);
	console.log("Total Pages:", totalPages);




	const productColors = products.map((product) => {
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

	console.log("All Colors:", allColors);
	console.log("Unique Colors:", uniqueColors);

	return (
		<div className="products-page-body">
			<img
				src="./productpageBanner.png"
				className="productpageBanner"
				alt="Product Page Banner"
			/>
			<div className="filter-products-container">
				{}
				<div className="filter-container">
					{}
					<Heading>Filter</Heading>
					<Button
						type="primary"
						style={{
							backgroundColor: "#F24C88",
							color: "white",
							marginBottom: "2px",
						}}
						onClick={handleFilters}>
						Add Filters
					</Button>
					<div className="filter">
						<div className="first-div">
							<b>
								<h5>Filter Options</h5>
							</b>
							<img src="./filter.png" alt="filter-icon" />
						</div>

						{}
						<div className="price-div">
							<b>
								<h5>Price</h5>
							</b>
							<img
								className="uparrow"
								src="./uparrow.svg"
								alt="price-toggle"
								onClick={togglePrice}
								style={{ cursor: "pointer" }}
							/>
						</div>

						{priceExpanded && (
							<div className="price-content">
								<Slider
									className="custom-slider"
									range
									min={0}
									max={2000000}
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

						{}

						{
}

						<div className="color-div">
							<b>
								<h5>Colors</h5>
							</b>
							<img
								className="uparrow"
								src="./uparrow.svg"
								alt="color-toggle"
								onClick={toggleColor}
								style={{ cursor: "pointer" }}
							/>
						</div>

						{}
						{colorExpanded && (
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
										onClick={() => handleColorClick(color?.name)}
									>
										<h4
											style={{
												color: "#fff",
												fontSize: "10px",
												textAlign: "center",
											}}>
											{color.name.toLowerCase()}
										</h4>
									</div>
								))}
							</div>
						)}
					</div>
					<img src="./Maryqueen.png" className="Maryqueen"></img>
				</div>

				{}
				<div className="products-container">
					<h3>
						<Heading>Fabrics</Heading>
					</h3>

					<Row gutter={[14, 14]}>
						{}
						{displayedProducts?.map((product) => {
							const firstColorImage =
								product.product_colors?.[0]?.images?.[0]?.image ||
								product.image;
							const firstPrice = product.product_colors?.[0]?.price;
							return (
								<Col span={6} key={product.id}>
									<Card
										cover={
											<Link to={`/fabrics/${product.id}`}>
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
														to={`/fabrics/${product.id}`}
														style={{
															color: "inherit",
															textDecoration: "none",
														}}>
														{product.name}
													</Link>
												}
												description="In stock"
											/>
											<Button
												type="primary"
												style={{
													width: "45%",
													backgroundColor: "#F6F6F6",
													color: "#3C4242",
												}}>
												Rs: {firstPrice}
											</Button>
										</div>
									</Card>
								</Col>
							);
						})}
					</Row>

					{}
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

export default SearchComponent;
