import React, { useEffect, useState } from "react";
import { fetchProducts, fetchCombinations } from "../../../store/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import "./Combination.css";
import { Link } from "react-router-dom";
import Heading from "../Heading/Heading";

const Combinations = () => {
	const dispatch = useDispatch();
	const { Combinations } = useSelector((state) => state.products);
	const { apiurl, access_token } = useSelector((state) => state.auth);
	const [combinationfetched, setcombinationsfetched] = useState(false);

	useEffect(() => {
		dispatch(fetchProducts());
		dispatch(fetchCombinations())
			.unwrap()
			.then(() => {
				setcombinationsfetched(true);
			});
	}, [dispatch]);

	return (
		<div className="combinationContainer">
			<Heading>Combos</Heading>
			<div className="combination-cards-container">
				{Combinations?.map((comb) => {
					const firstImage = comb.images?.[0]?.image;
					return (
						<div key={comb.id} className="combination-card">
							{firstImage ? (
								<Link to={`/combinations/${comb.id}`}>
									<img
										className="combination-card-image"
										src={`${apiurl}${firstImage}`}
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
		</div>
	);
};

export default Combinations;
