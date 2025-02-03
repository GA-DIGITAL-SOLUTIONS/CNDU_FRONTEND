import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/productsSlice";
import { useNavigate } from "react-router-dom";
import { addCartItem, fetchCartItems } from "../../store/cartSlice";

import { logout } from "../../store/authSlice";
import { fetchOutfits } from "../../store/OutfitSlice";
import Body from "./Body/Body";

const Home = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { products, loading, error } = useSelector((store) => store.products);
	const { apiurl, access_token } = useSelector((store) => store.auth);
	// console.log("products", products);
	const cartStoreItems = useSelector((state) => state.cart.items);
	// console.log("cartStore", cartStoreItems);
	const wishListItems = useSelector((state) => state.wishlist.items);
	const [selectedOptions, setSelectedOptions] = useState({});
	// console.log("wishitems", wishListItems);

	// useEffect(() => {
	// 	dispatch(fetchProducts());

	// 	dispatch(fetchOutfits({ apiurl }));
	// }, [dispatch]);
	// console.log("selectedOptions", selectedOptions);

	if (loading) {
		return <div>Loading...</div>;
	} else if (error) {
		return <div>Error: {error}</div>;
	}

	const handleAddToCart = async (product) => {
		const selectedColor = selectedOptions[product.id]?.color;
		const selectedQuantity = selectedOptions[product.id]?.quantity || 1;
		const productInCart = cartStoreItems.find(
			(item) => item.object_id === product.id
		);

		// console.log("productInCart", productInCart);
		if (!productInCart) {
			const item = {
				item_id: product.id,
				type: "product",
				quantity: selectedQuantity,
				color: selectedColor,
			};
			try {
				const resultAction = await dispatch(
					addCartItem({ apiurl, access_token, item })
				);
				if (addCartItem.fulfilled.match(resultAction)) {
					// console.log("Item added to cart:", resultAction.payload);

					dispatch(fetchCartItems({ apiurl, access_token }));
				}
			} catch (error) {
				// console.error("Failed to add item to cart:", error);
			}
		} else {
			// console.log(`Product with ID ${product.id} is already in the cart.`);
		}
	};

	const OpenCart = () => {
		navigate(`/cart`);
	};
	const OpenWishList = () => {
		navigate("/wishlist");
		// console.log("try to do dispatch for wishlist here ");
	};

	const openOrders = () => {
		navigate("/orders");
		// console.log("here also we can fetch the orders ");
	};
	const Logout = () => {
		dispatch(logout());
		navigate("/logout");
		// console.log("successfully logged out");
	};
	const OpenOutfits = () => {
		navigate("/outfits");
	};

	return (
			<Body />
	);
};

export default Home;
