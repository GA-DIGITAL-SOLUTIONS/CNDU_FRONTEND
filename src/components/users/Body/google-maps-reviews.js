export default function googlePlaces(google, elem, options) {
	let settings = {
		header: "",
		footer: "",
		maxRows: 6,
		minRating: 3,
		months: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		],
		textBreakLength: "90",
		shortenNames: true,
		replaceAnonymous: false,
		anonymousName: "A Google User",
		anonymousNameReplacement: "User chose to remain anonymous",
		showDate: false,
		showProfilePicture: true,
		placeId: "",
	};
	settings = { ...settings, ...options };
	const targetDiv = document.getElementById(elem);

	const renderHeader = (header) => {
		if (header) {
			targetDiv.innerHTML += `<div class='reviews-header'>${header}</div>`;
		}
	};

	const renderFooter = (footer) => {
		if (footer) {
			targetDiv.innerHTML += `<div class='reviews-footer'>${footer}</div>`;
		}
	};

	const shortenName = (name) => {
		if (name === undefined) return settings.anonymousName;

		if (name.split(" ").length > 1) {
			const splitName = name.split(" ");
			const firstName = splitName[0];
			const lastNameFirstLetter = splitName[1][0];

			if (lastNameFirstLetter === ".") {
				return firstName;
			}
			return `${firstName} ${lastNameFirstLetter}.`;
		}
		if (name !== undefined) {
			return name;
		}
		return settings.anonymousName;
	};

	const renderStars = (rating) => {
		let stars = '<div class="review-stars"><ul>';

		for (let i = 0; i < rating; i += 1) {
			stars += '<li><i class="star"></i></li>';
		}
		if (rating < 5) {
			for (let i = 0; i < 5 - rating; i += 1) {
				stars += '<li><i class="star inactive"></i></li>';
			}
		}
		stars += "</ul></div>";
		return stars;
	};

	const convertTime = (unixTimestamp) => {
		const a = new Date(unixTimestamp * 1000);
		const { months } = settings;
		const time = `${a.getDate()}. ${months[a.getMonth()]} ${a.getFullYear()}`;
		return time;
	};

	const filterReviewsByMinRating = (reviews) => {
		if (reviews === void 0) {
			return [];
		}
		for (let i = reviews.length - 1; i >= 0; i -= 1) {
			if (reviews[i].rating < settings.minRating) {
				reviews.splice(i, 1);
			}
		}
		return reviews;
	};

	const sortReviewsByDateDesc = (reviews) => {
		if (
			typeof reviews !== "undefined" &&
			reviews != null &&
			reviews.length != null &&
			reviews.length > 0
		) {
			return reviews
				.sort((a, b) => (a.time > b.time ? 1 : b.time > a.time ? -1 : 0))
				.reverse();
		}
		return [];
	};

	const rescueAnonymousReviews = (review, name) => {
		if (
			settings.replaceAnonymous === true &&
			settings.anonymousName !== "" &&
			(review.author_name.toLowerCase() ===
				settings.anonymousName.toLowerCase() ||
				review.author_name === undefined) &&
			settings.anonymousNameReplacement !== ""
		) {
			return settings.anonymousNameReplacement;
		}
		return name;
	};

	const renderReviews = (reviews) => {
		reviews.reverse();
		let html = "";
		let rowCount =
			settings.maxRows > 0 ? settings.maxRows - 1 : reviews.length - 1;

		rowCount = rowCount > reviews.length - 1 ? reviews.length - 1 : rowCount;

		for (let i = rowCount; i >= 0; i -= 1) {
			const review = reviews[i];
			if (!review) return;
			const stars = renderStars(review.rating);
			const date = convertTime(review.time);
			let name = settings.shortenNames
				? shortenName(review.author_name)
				: review.author_name;
			name = rescueAnonymousReviews(review, name);
			const profilePicture =
				settings.showProfilePicture && review.profile_photo_url
					? `<img class='review-profile-pic' src='${review.profile_photo_url}' alt='${name}' />`
					: "";

			const style =
				review.text.length > parseInt(settings.textBreakLength, 10)
					? "review-item-long"
					: "review-item";

			let reviewText = review.text;
			if (settings.showDate === true) {
				reviewText = `<span class='review-date'>${date}</span> ${reviewText}`;
			}

			html +=
				`<div class=${style}><div class='review-meta'>${profilePicture}<span class='review-author'>${name}</span>` +
				`</div>${stars}<p class='review-text'>${reviewText}</p></div>`;
		}
		targetDiv.innerHTML += html;
	};

	const service = new google.maps.places.PlacesService(targetDiv);
	const request = {
		placeId: settings.placeId,
	};
	const callback = (place, status) => {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			const filteredReviews = filterReviewsByMinRating(place.reviews);
			const sortedReviews = sortReviewsByDateDesc(filteredReviews);
			if (sortedReviews.length > 0) {
				renderHeader(settings.header);
				renderReviews(sortedReviews);
				renderFooter(settings.footer);
			}
		}
	};

	if (settings.placeId === undefined || settings.placeId === "") {
		console.error("NO PLACE ID DEFINED");
		return true;
	}

	return service.getDetails(request, callback);
}
