import React, { useEffect, useState } from "react";
import { Layout, Menu, Drawer, Button } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Badge } from "antd";
import {
	DiscordOutlined,
	MenuOutlined,
	ShoppingCartOutlined,
	UserOutlined,
} from "@ant-design/icons";
import "./Header.css";
import { searchProducts } from "../../../store/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems, updateCartCount } from "../../../store/cartSlice";


const Header = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedKey, setSelectedKey] = useState("home");

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [cartItemsCount,setcartItemsCount]=useState(3);
	const {apiurl,access_token}=useSelector((state)=>state.auth);
	const {items,cartCount}=useSelector((state)=>state.cart);

	console.log("cartitme",items?.items?.length)


const dispatch = useDispatch();

	useEffect(() => {
		const path = location.pathname.split("/")[1];
		setSelectedKey(path || "home");
	}, [location.pathname]);

	useEffect(()=>{
		dispatch(fetchCartItems({ apiurl, access_token })).then(()=>{
			if(items?.items?.length){
dispatch(updateCartCount(items?.items?.length))
			}
		})
	},[dispatch])


	const handleMenuClick = (e) => {
		setSelectedKey(e.key);
		setIsDrawerOpen(false);
	};


	const handleSearch = () => {
		navigate(`/search/${searchTerm}`);
		console.log("Search Term:", searchTerm);
	};



	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
		navigate(`/search/${searchTerm}`);
		}
};



	const menuItems = [
		{ key: "fabrics", label: <Link to="/fabrics">Fabrics</Link> },
		{
			key: "collections",
			label: <Link to="/CNDUCollections">CNDU SpecialCollections</Link>,
		},
		{ key: "products", label: <Link to="/products">Sarees</Link> },
		{ key: "combinations", label: <Link to="/combinations">Combinations</Link> },
		{
			key: "cart",
			label: (
				<Link to="/cart" style={{ display: "flex", alignItems: "center" }}>
					{cartCount > 0 ? (
						<Badge count={cartCount} overflowCount={1000} size="medium" offset={[-1, 0]}>
							<ShoppingCartOutlined style={{ fontSize: "25px" }} />
						</Badge>
					) : (
						<ShoppingCartOutlined style={{ fontSize: "25px" }} />
					)}
					<span style={{ marginLeft: 8 }}>Cart</span>
				</Link>
			),
		},
		
		{
			key: "profile",
			label: access_token ? (
				<Link to="/profile">
					<UserOutlined />
				</Link>
			) : (
				<Link to="/login">Login</Link>
			),
		},
		{
			key: "search",
			label: (
				<div className="icon-item">
					<input
						placeholder="Search"
						style={{
							backgroundColor: "#fbf9f9",
							border: "none",
							borderRadius: "10px",
							outline: "none",
							textIndent: "10px",
							height: "30px",
							width: "80%",
						}}
						onChange={(e) => setSearchTerm(e.target.value)}
						onKeyDown={handleKeyPress}
					/>
					<img
						src="/SearchIcon.svg"
						alt="Search"
						className="icons"
						onClick={handleSearch}
						style={{ marginLeft: "10px", cursor: "pointer" }}
					/>
				</div>
			),
		},
	];

	return (
		<Layout.Header className="custom_header">
			<Link to="/">
				<div className="header-logo">
					<img src="/logo.png" alt="Logo" className="logo-image" />
				</div>
			</Link>

			<Button
				className="mobile-menu-button"
				icon={<MenuOutlined />}
				onClick={() => setIsDrawerOpen(true)}
			/>

			<Drawer
				title="Menu"
				placement="left"
				onClose={() => setIsDrawerOpen(false)}
				open={isDrawerOpen}>
				<Menu
					mode="inline"
					selectedKeys={[selectedKey]}
					onClick={handleMenuClick}
					items={menuItems}
				/>
			</Drawer>

			<Menu
				mode="horizontal"
				className="header-nav desktop-nav"
				selectedKeys={[selectedKey]}
				onClick={handleMenuClick}
				items={menuItems}
			/>
		</Layout.Header>
	);
};

export default Header;
