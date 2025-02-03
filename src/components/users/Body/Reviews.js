import React, { useEffect, useState } from "react";
import "./Reviews.css";
import googlePlaces from "./google-maps-reviews";
import { fetchReviews } from "./google-maps-reviews";

export default function App() {
	const [reviews, setReviews] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [reviewsToShow, setReviewsToShow] = useState(3);

	useEffect(() => {
		fetchReviews(window.google, {
			placeId: "ChIJyYTLEeqRyzsR4RzpgvE1T1Q",
		})
			.then((data) => {
				// console.log("Fetched reviews:", data);
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
		setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
	};

	useEffect(() => {
		const updateReviewsToShow = () => {
		  if (window.innerWidth <= 768) {
			setReviewsToShow(2); // Show 2 reviews on smaller screens
		  } else {
			setReviewsToShow(3); // Show 3 reviews on larger screens
		  }
		};
	
		updateReviewsToShow();
		window.addEventListener("resize", updateReviewsToShow);
	
		return () => {
		  window.removeEventListener("resize", updateReviewsToShow);
		};
	  }, []);

	  useEffect(() => {
		fetchReviews(window.google, {
		  placeId: "ChIJyYTLEeqRyzsR4RzpgvE1T1Q",
		})
		  .then((data) => {
			console.log("Fetched reviews:", data);
			setReviews(data);
		  })
		  .catch((error) => {
			// console.error("Error fetching reviews:", error);
		  });
	  }, []);

	// Handle right button click
	const handleRightClick = () => {
		setCurrentIndex((prevIndex) =>
			Math.min(prevIndex + 1, Math.max(reviews.length - 3, 0))
		);
	};

	const renderStars = (rating) => {
		const totalStars = 5; // Total number of stars
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
				<button className="scroll-button left" onClick={handleLeftClick}>
					◀
				</button>
				<div className="reviews-container">
					{reviews.slice(currentIndex, currentIndex + reviewsToShow).map((review, index) => (
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
				<button className="scroll-button right" onClick={handleRightClick}>
					▶
				</button>
			</div>
		</div>
	);
}
