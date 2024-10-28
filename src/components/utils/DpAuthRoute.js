import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";
import Loader from "../Loader/Loader";
import { message } from "antd";

export const DpAuthRoute = () => {
	const { token, apiurl } = useAuth();
	const [role, setRole] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isValidToken, setIsValidToken] = useState(false);
	const verifyToken = async (token) => {
		try {
			const response = await fetch(`${apiurl}/verify-token/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ token }),
			});
			if (!response.ok) {
				throw new Error("Failed to verify token");
			}
			const data = await response.json();
			setRole(data.role);
			return data.valid === true;
		} catch (error) {
			message.error("Token expired! Please Login again.");
			return false;
		}
	};
	useEffect(() => {
		const checkTokenValidity = async () => {
			if (token && token !== "undefined" && token !== "null") {
				const isValid = await verifyToken(token);
				setIsValidToken(isValid);
			}
			setIsLoading(false);
		};
		checkTokenValidity();
	}, [token]);

	if (isLoading) {
		return (
			<div>
				<Loader />
			</div>
		);
	}

	if (!isValidToken || role !== "delivery_agent") {
		return (
			<Navigate
				to="/login"
				state={{ error: "Token expired. Please login again." }}
			/>
		);
	}

	return <Outlet />;
};
