import React, { useState } from "react";
import "./Section5.css";

import Heading from "../../Heading/Heading";

const Section5 = () => {
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
		<div className="Section5-wholediv">
			<div className="sub-sec1">
				<Heading>What people all over the world are saying about us</Heading>
				<div className="cards-container">
					<div className="card">
						<h1>User A</h1>
						<p>I love using this product every day!</p>
					</div>
					<div className="card">
						<h1>User B</h1>

						<p>It has changed my workflow!</p>
					</div>
					<div className="card">
						<h1>User C</h1>
						<p>The team is so helpful!</p>
					</div>
				</div>

				<div className="arrows-container">
					<div className="Leftarrow-container">
						<img src="./Leftarrow.png" alt="Left Arrow" />
					</div>
					<div className="Rightarrow-container">
						<img src="./Rightarrow.png" alt="Right Arrow" />
					</div>
				</div>
			</div>

			<div className="sub-sec2">
				<Heading>Frequently asked questions</Heading>
				<div className="cardandquestions-container">
					<div className="question-container">
						{[
							"What is your return policy?",
							"How do I track my order?",
							"Can I purchase a gift card?",
						].map((question, index) => (
							<div className="question-box" key={index}>
								<div className="question-header">
									<h3>{question}</h3>
									<button
										onClick={() => toggleQuestion(index)}
										className="toggle-button">
										{expandedQuestions[index] ? "✕" : "+"}
									</button>
								</div>
								{expandedQuestions[index] && (
									<div className="question-content">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit.
											Fusce porttitor sem vel dolor vestibulum, et efficitur
											lorem interdum.
										</p>
									</div>
								)}
							</div>
						))}
					</div>
					<div className="questions-card-container">
						<img src="./Questionmarkicon.png" />
						<h3 className="card-title">Do you have more questions?</h3>
						<p className="card-text">
							Lorem ipsum dolor sit amet consectetur. Quam libero viverra
							faucibus condimentum.
						</p>
						<button className="card-button">Shoot a direct mail</button>
					</div>
				</div>
			</div>

			<div className="sub-sec3">
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
			</div>

			<div className="sub-sec4"></div>
		</div>
	);
};

export default Section5;
