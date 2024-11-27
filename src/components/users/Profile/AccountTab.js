import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AccountTab = () => {
	const [user, setUser] = useState({});
	const { apiurl } = useSelector((state) => state.auth);

	const access_token = sessionStorage.getItem("access_token");

	useEffect(() => {
		axios
			.get(`${apiurl}/user-details`, {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			})
			.then((response) => {
				setUser(response.data.data);
			})
			.catch((err) => {
				console.log("Failed to fetch user details");
			});
	}, [access_token, apiurl]);

	return (
		<div className="account-tab">
			<div className="account-tab__field account-tab__username">
				<strong>User Name *</strong>
				<span>{user.username || ""}</span>
			</div>
			<div className="account-tab__field account-tab__display-name">
				<strong>Phone Number *</strong>
				<span>{user.phone_number || ""}</span>
			</div>
			<div className="account-tab__field account-tab__email">
				<strong>Email *</strong>
				<span>{user.email || ""}</span>
			</div>
		</div>
	);
};

export default AccountTab;
