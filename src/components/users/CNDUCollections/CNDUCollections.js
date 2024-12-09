import React, { useEffect, useState } from "react";
import { Slider, Card, Row, Col, Button, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCollections, fetchProducts } from "../../../store/productsSlice";
import Specialdealscard from "../cards/Specialdealscard";

const { Meta } = Card;



const CNDUCollections = () => {

	
	const [priceRange, setPriceRange] = useState([0, 20000]);
	const [selectedColor, setSelectedColor] = useState(null);
	const [priceExpanded, setPriceExpanded] = useState(false);
	const [Filters , setFilters] = useState(false);

	const [colorExpanded, setColorExpanded] = useState(false);

	const [filter, setFilter] = useState(false);
	const [filteredProducts, setFilteredProducts] = useState([]);

	const dispatch = useDispatch();

	// Fetch products from Redux store
	useEffect(() => {
		dispatch(fetchCollections());
		dispatch(fetchProducts());
	}, [dispatch]);

	const { products,collections, loading, error } = useSelector((store) => store.products);
	const { apiurl } = useSelector((state) => state.auth); // Dynamically use apiurl for image paths



	console.log("c", collections,"products",products);
	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9; 

	const handlePriceChange = (value) => {
		setPriceRange(value);
		console.log("Selected Price Range:", value);
		handleFilters();

	};

	const handleColorClick = (color) => {
		setSelectedColor(color);
		console.log("Selected Color:", color);
		handleFilters();

	};

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

		const filtered = collections.filter((product) => {
			const colorPriceMatch = product.product_colors?.some((colorObj) => {
				const colorMatch = selectedColor
					? colorObj.color.name.toLowerCase() === selectedColor.toLowerCase()
					: true;
				const priceMatch =
					colorObj.price >= priceRange[0] && colorObj.price <= priceRange[1];

				return colorMatch && priceMatch;
			});

			return colorPriceMatch; // Keep product if at least one product_color matches
		});

		console.log("Filtered Products:", filtered);
		setFilteredProducts(filtered);
		setFilter(true); // Set filter state to true
		setCurrentPage(1); // Reset to first page when filters are applied
	};

	// Calculate total products and total pages
	const totalProducts = filter ? filteredProducts.length : collections.length;
	const totalPages = Math.ceil(totalProducts / pageSize);

	// Pagination: Show either filtered or all products based on the filter state
	const displayedProducts = (filter ? filteredProducts : collections)?.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	console.log("Total Products:", totalProducts);
	console.log("Total Pages:", totalPages);

	// Handle page change
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const [activeKey, setActiveKey] = useState(["1"]);

	const handleCollapseChange = (key) => {
		setActiveKey(key);
	};
	const isExpanded = activeKey.includes("1");

	const items = [
		{
			key: "1",
			label: "",
			children: (
				<div>
					{isExpanded && (
						<div className="price-content">
							<Slider
								className="custom-slider"
								range
								min={0}
								max={20000}
								step={500}
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
				</div>
			),
		},
		{
			key: "2",
			label: "This is panel header 2",
			children: (
				<p style={{ paddingInlineStart: 24 }}>
					Cats are small, carnivorous mammals...
				</p>
			),
		},
		{
			key: "3",
			label: "This is panel header 3",
			children: (
				<p style={{ paddingInlineStart: 24 }}>
					Birds are warm-blooded vertebrates...
				</p>
			),
		},
	];

	const productColors = collections.map((product) => {
		return product.product_colors;
	});
	console.log("productColors", productColors);

	const allColors = productColors.flatMap((Pcobj) =>
		Pcobj.map((singlcolor) => singlcolor.color)
	);

	// Deduplicate the combined array by color name (case-insensitive)
	const uniqueColors = allColors.filter(
		(color, idx, self) =>
			self.findIndex(
				(c) => c.name.toLowerCase() === color.name.toLowerCase()
			) === idx
	);

	console.log("All Colors:", allColors); // Debugging all combined colors
	console.log("Unique Colors:", uniqueColors); // Debugging deduplicated colors

	return (
		<div className="products-page">
			<img
				src="./productpageBanner.png"
				className="productpageBanner"
				alt="Product Page Banner"
			/>
			<div className="filter-products-container">
				{/* Filter Section */}
				<div className="filter-container">
					{/* <h3></h3> */}
					{/* <Button
						type="primary"
						style={{
							backgroundColor: "#F24C88",
							color: "white",
							marginBottom: "2px",
						}}
						onClick={handleFilters}>
						Add Filters
					</Button> */}
					<div className="filter">
						<div className="first-div">
							<b>
								<h5>Filter Options</h5>
							</b>
							<img src="./filter.png" alt="filter-icon" onClick={togglefilters}/>
						</div>

						{/* Price Section */}
						<div className="price-div">
							<b>
								<h5>Price</h5>
							</b>
							{/* <img
								className="uparrow"
								src="./uparrow.svg"
								alt="price-toggle"
								onClick={togglePrice}
								style={{ cursor: "pointer" }}
							/> */}
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
							{/* <img
								className="uparrow"
								src="./uparrow.svg"
								alt="color-toggle"
								onClick={toggleColor}
								style={{ cursor: "pointer" }}
							/> */}
						</div>

						{/* Color Options Expanded Content */}
						{Filters && (
							<div className="color-content">
								{uniqueColors.map((color) => (
									<div
										key={color?.name}
										className="color-box"
										style={{
											backgroundColor: color?.name.toLowerCase(), // Dynamic color
											border:
												selectedColor === color?.name
													? "2px solid pink" // Highlight selected color
													: "1px solid #ddd",
											width: "40px", // Dimensions for color box
											height: "40px",
											borderRadius: "30px", // Circular box
											cursor: "pointer", // Pointer cursor for better UX
										}}
										onClick={() => handleColorClick(color?.name)} // Handle click
									>
									</div>
								))}
							</div>
						)}
					</div>
					<img src="./Maryqueen.png" className="Maryqueen"></img>
				</div>

				{/* Products Section */}
				<div className="products-container">
					
					<div className="products-main-cont">
						{/* Check if products are loaded and display them */}
						{displayedProducts?.map((product) => {
							const firstColorImage =
								product.product_colors?.[0]?.images?.[0]?.image ||
								product.image; // here first color image
							const firstPrice = product.product_colors?.[0]?.price; // first color
							return (
								<>
									<Card
										className="product-item"
										cover={
											<Link to={`/${product.type}s/${product.id}`}>
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
														to={`/${product.type}s/${product.id}`}
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
												// icon={<DollarOutlined />}
												style={{
													width: "45%",
													backgroundColor: "#F6F6F6",
													color: "#3C4242",
												}}>
												Rs: {firstPrice}
											</Button>
										</div>
									</Card>
								</>
							);
						})}
					</div>

					{/* Pagination */}
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
										src="/Paginationleftarrow.svg" // Public folder path
										alt="Previous"
										style={{ width: "20px" }}
									/>
								);
							}
							if (type === "next") {
								return (
									<img
										src="/Paginationrightarrow.svg" // Public folder path
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

export default CNDUCollections;
