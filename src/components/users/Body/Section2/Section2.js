import React, { useEffect, useState } from "react";
import "./Section2.css";
import Heading from "../../Heading/Heading";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const Section2 = () => {

	const {apiurl}=useSelector((state)=>state.auth)

	// here fetch new products here 
	const [newProducts, setNewProducts] = useState(null);

  useEffect(() => {
    fetch(`${apiurl}/homepage/data/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Ensures JSON response
        Accept: "application/json", // Accept only JSON responses
      },
    })
      .then((response) => response.json())
      .then((data) => setNewProducts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
	console.log("newProducts",newProducts?.dress?.data?.product_colors?.[0]?.images?.[0]?.image)
	return (
		<div className="total-section2">
			<div className="section2-container">
				<Heading>NEW ARRIVALS</Heading>

				<div className="cards-container">
					<div className="card">
						<Link to="/fabrics">
							<img src={`${apiurl}${newProducts?.fabric?.data?.product_colors?.[0]?.images?.[0]?.image}`} alt="Fabrics" className="cardimg" />
							<div className="card-text">
								<div className="text-left">
									<h1>Fabrics</h1>
									<h4>Explore now!</h4>
								</div>
								<div className="arrow-right">&rarr;</div>
							</div>
						</Link>
					</div>
					<div className="card">
						<Link to="/products">
							<img
							src={`${apiurl}${newProducts?.dress?.data?.product_colors?.[0]?.images?.[0]?.image}`}
								alt="Sarees"
								className="cardimg"
							/>
							<div className="card-text">
								<div className="text-left">
									<h1>Sarees</h1>
									<h4>Explore now!</h4>
								</div>
								<div className="arrow-right">&rarr;</div>
							</div>
						</Link>
					</div>
					<div className="card">
						<Link to="/collections">
							<img
								src={`${apiurl}${newProducts?.special_collection?.data?.product_colors?.[0]?.images?.[0]?.image}`}
								alt="CNDU Collections"
								className="cardimg"
							/>
							<div className="card-text">
								<div className="text-left">
									<h1>CNDU Signature Collections</h1>
									<h4>Explore now!</h4>
								</div>

								<div className="arrow-right">&rarr;</div>
							</div>
						</Link>
					</div>
				</div>
				<button className="seeallbut">See all &rarr;</button>
			</div>
		</div>
	);
};

export default Section2;
