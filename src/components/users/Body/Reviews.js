import React, { useEffect, useState } from "react";
import "./Reviews.css";
import googlePlaces from "./google-maps-reviews";
import { fetchReviews } from "./google-maps-reviews";

export default function App() {
	const [reviews, setReviews] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [reviewsToShow, setReviewsToShow] = useState(1);

	useEffect(() => {
		fetchReviews(window.google, {
			placeId: "ChIJyYTLEeqRyzsR4RzpgvE1T1Q",
		})
			.then((data) => {
				setReviews(data);
			})
			.catch((error) => {
				console.error("Error fetching reviews:", error);
			});
	}, []);

	useEffect(() => {
		googlePlaces(window.google, "google-reviews", {
			placeId: "ChIJyYTLEeqRyzsR4RzpgvE1T1Q",
		});
	}, []);

	const handleLeftClick = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	useEffect(() => {
		fetchReviews(window.google, {
			placeId: "ChIJyYTLEeqRyzsR4RzpgvE1T1Q",
		})
			.then((data) => {
				console.log("Fetched reviews:", data);
				setReviews(data);
			})
			.catch((error) => {});
	}, []);

	const handleRightClick = () => {
		if (currentIndex < reviews.length - 1) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const renderStars = (rating) => {
		const totalStars = 5;
		return (
			<div className="review-stars">
				<ul>
					{Array.from({ length: totalStars }, (_, index) => (
						<li key={index}>
							<i className={`star ${index < rating ? "" : "inactive"}`}></i>
						</li>
					))}
				</ul>
			</div>
		);
	};

	return (
		<div className="App">
			<div className="google-reviews2">
				{currentIndex > 0 && (
					<button className="scroll-button left" onClick={handleLeftClick}>
						◀
					</button>
				)}
				<div className="reviews-container">
					{reviews
						.slice(currentIndex, currentIndex + reviewsToShow)
						.map((review, index) => (
							<div className="review-card" key={index}>
								<div className="profile">
									<img
										className="review-profile-pic"
										src={review.profile_photo_url}
										alt={review.author_name || "Anonymous"}
									/>
								</div>
								<div className="review-header">
									<strong>{review.author_name || "Anonymous"}</strong>
								</div>
								<div className="stars">{renderStars(review.rating)}</div>
								<div className="review-description">{review.text}</div>
							</div>
						))}
				</div>
				{currentIndex < reviews.length - 1 && (
					<button className="scroll-button right" onClick={handleRightClick}>
						▶
					</button>
				)}
			</div>
		</div>
	);
}
