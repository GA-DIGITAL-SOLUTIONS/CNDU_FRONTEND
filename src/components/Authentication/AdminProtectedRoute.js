// src/components/AdminProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
	const userRole = sessionStorage.getItem("userRole");

	if (userRole !== "admin") {
		return <Navigate to="/login" />;
	}

	return <Outlet />;
};

export default AdminProtectedRoute;
