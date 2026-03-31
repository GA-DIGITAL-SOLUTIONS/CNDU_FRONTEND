import React, { useState } from "react";
import "./Section5.css";

import Heading from "../../Heading/Heading";
import GoogleReviews from "../Reviews";
import { useNavigate } from "react-router-dom";
import plusandcross from './plusandcrosssymbol.png'
import cndubg from '../bannerimages/cndubg.png'

const Section5 = () => {
	const navigate = useNavigate();
	const [expandedQuestions, setExpandedQuestions] = useState([
		false,
		false,
		false,
	]);
	const toggleQuestion = (index) => {
		setExpandedQuestions((prevState) => {
			const newExpandedQuestions = [...prevState];
			newExpandedQuestions[index] = !newExpandedQuestions[index];
			return newExpandedQuestions;
		});
	};

	return (
		<div className="Section5-wholediv cndubg" >
			<div className="sub-sec1">
				<Heading>What people all over the world are saying about us</Heading>
				<GoogleReviews />
			</div>

			<div className="sub-sec2">
				<Heading>Frequently Asked Questions (FAQs)</Heading>
				<div className="cardandquestions-container">
					<div className="question-container">
						{[
							"What types of fabrics do you offer?",
							"Do you manufacture your own fabrics?",
							"What kind of sarees do you provide?",
							"Do you sell ready-made blouses?",
							"Where is your offline store located?",
							"Do you deliver across India?",
							"What makes your fabrics and sarees unique?",
							"Do you offer bulk or wholesale purchases?",
							"Do you provide a fashion designing course?",
							"How can I stay updated with your latest collections and offers?",
						].map((question, index) => (
							<div className="question-box" key={index}>
								<div className="question-header">
									<h3>{question}</h3>
									<button
										onClick={() => toggleQuestion(index)}
										className="toggle-button">
										{expandedQuestions[index] ? <img src={plusandcross} style={{rotate:"45deg"}}/> :<img src={plusandcross}/>}
									</button>
								</div>
								{expandedQuestions[index] && (
									<div className="question-content">
										<p>
											{
												[
													"We offer a wide range of fabrics, including ethnic, fancy, plain, printed, cottons, georgettes, and theme-based designs. Our collection is curated to suit every style and occasion.",
													"Yes, all our fabrics are designed and manufactured in-house to ensure premium quality and unique designs that stand out in the market.",
													"Our saree collection includes ethnic sarees, fancy sarees, and exclusive CNDU special collections, catering to both daily wear and festive occasions.",
													"Yes, we offer a variety of blouse options, including ready-made blouses, embroidered blouse pieces, and work blouse pieces to match your sarees and style preferences.",
													"Our first offline store is located in Gajularamaram, near Kukatpally, Hyderabad. Visit us for an in-person shopping experience.",
													"Yes, we provide delivery services throughout India. Additionally, we cater to customers in select international locations.",
													"Our products are uniquely designed, ensuring they stand out from mass-market offerings. With our own manufacturing process, we maintain strict quality standards and originality.",
													"Yes, we welcome bulk or wholesale orders. Please contact us directly for customized quotes and details.",
													"Yes, we offer a free, comprehensive fashion designing course on our YouTube channel, CNDU Designer Studios. It’s perfect for anyone looking to learn professional techniques.",
													"Follow us on our social media platforms and subscribe to our newsletter for updates on new arrivals, special collections, and exclusive offers.",
												][index]
											}
										</p>
									</div>
								)}
							</div>
						))}
					</div>
					<div className="questions-card-container">
						<img src="./Questionmarkicon.png" alt="Question Mark Icon" />
						<h3 className="card-title">Do you have more questions?</h3>
						<p className="card-text">
							Reach out to us with your queries, and our team will assist you
							promptly. We're here to ensure you have all the information you
							need.
						</p>
						<button onClick={()=>{navigate('/contact')}} className="card-button" style={{cursor:'pointer'}}>Shoot a direct mail</button>
					</div>
				</div>
			</div>

			{/* <div className="sub-sec3">
				<div className="sign-up-card">
					<h5>
						Sign up now. so your selected items are saved to your personal cart.
					</h5>
					<div className="input-container">
						<input
							type="email"
							placeholder="Enter your email"
							className="sign-up-input"
						/>
						<button className="sign-up-button">Sign Up</button>
					</div>
				</div>
			</div> */}

			<div className="sub-sec4"></div>
		</div>
	);
};

export default Section5;
