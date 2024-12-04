// src/components/AdminProtectedRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
	const{userRole} = useSelector((state)=>state.auth)

	if (userRole !== "admin") {
		return <Navigate to="/login" />;
	}

	return <Outlet />;
};

export default AdminProtectedRoute;
