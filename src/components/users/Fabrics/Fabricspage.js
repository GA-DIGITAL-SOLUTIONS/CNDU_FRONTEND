import React, { useEffect, useState } from "react";
import { Slider, Card, Button, Pagination } from "antd";
import "./Fabricspage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchFabrics, fetchProducts } from "../../../store/productsSlice";
import Specialdealscard from "../cards/Specialdealscard";
import Heading from "../Heading/Heading";

import { Link } from "react-router-dom";
import Loader from "../../Loader/Loader";

const { Meta } = Card;

const Fabricspage = () => {
	const [priceRange, setPriceRange] = useState([0, 20000]);
	const [selectedColor, setSelectedColor] = useState(null);
	const [Filters, setFilters] = useState(false);

	const [filter, setFilter] = useState(false);
	const [filteredProducts, setFilteredProducts] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchFabrics());
		dispatch(fetchProducts());
	}, [dispatch]);

	const { products, fabrics, fabricsloading, fabricserror } = useSelector(
		(store) => store.products
	);
	const { apiurl } = useSelector((state) => state.auth);

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

	const togglefilters = () => {
		setFilters(true);
	};

	const handleFilters = () => {
		const filtered = fabrics.filter((product) => {
			const colorPriceMatch = product.product_colors?.some((colorObj) => {
				const colorMatch = selectedColor
					? colorObj.color.hexcode === selectedColor
					: true;
				const priceMatch =
					colorObj.price >= priceRange[0] && colorObj.price <= priceRange[1];

				return colorMatch && priceMatch;
			});

			return colorPriceMatch;
		});

		setFilteredProducts(filtered);
		setFilter(true);
		setCurrentPage(1);
	};

	const totalProducts = filter ? filteredProducts.length : fabrics.length;

	const displayedProducts = (filter ? filteredProducts : fabrics)?.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const productColors = fabrics.map((product) => {
		return product.product_colors;
	});

	const allColors = productColors.flatMap((Pcobj) =>
		Pcobj.map((singlcolor) => singlcolor.color)
	);

	const uniqueColors = allColors.filter(
		(color, idx, self) =>
			self.findIndex(
				(c) => c.hexcode === color.hexcode
			) === idx
	);

	return (
		<div className="products-page" style={{ position: "relative" }}>
			{fabricsloading && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "60%",
						backgroundColor: "rgba(255, 255, 255, 0.8)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 9999, 
					}}
				>
					<Loader />
				</div>
			)}
	
			{/* Main Content */}
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
								style={{ cursor: "pointer" }}
								src="./filter.png"
								alt="filter-icon"
								onClick={togglefilters}
							/>
						</div>
	
						<div className="price-div">
							<b>
								<h5>Price</h5>
							</b>
						</div>
	
						{true && (
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
	
						{true && (
							<div className="color-content">
								{uniqueColors.map((color) => (
									<div
										key={color?.hexcode}
										className="color-box"
										style={{
											backgroundColor: color?.hexcode,
											border:
												selectedColor === color?.hexcode
													? "2px solid #f24c88"
													: "1px solid #ddd",
											width: selectedColor === color?.hexcode
											? "45px"
											: "40px",
											height:  selectedColor === color?.hexcode
											? "45px"
											: "40px",
											borderRadius: "30px",
											cursor: "pointer",
										}}
										onClick={() => handleColorClick(color?.hexcode)}
									>
                    <div className="color-box-tooltip">{color?.name}</div>
									</div>
								))}
								
							</div>
						)}
					</div>
					<img
						src="./Maryqueen.png"
						className="Maryqueen"
						alt="filter-cndu"></img>
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
															display: "inline-block",
															whiteSpace: "nowrap",
															overflow: "hidden",
															textOverflow: "ellipsis",
															maxWidth: "260px",
														}}>
														{product.name}
													</Link>
												}
												description={
													<div className="prod-desc">
														<div>In stock</div>
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
												}
											/>
										</div>
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
	
		</div>
	);
	
	
};

export default Fabricspage;
