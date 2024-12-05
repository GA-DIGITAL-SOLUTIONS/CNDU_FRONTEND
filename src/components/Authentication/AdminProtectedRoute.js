// src/components/AdminProtectedRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { message } from "antd";

const AdminProtectedRoute = () => {
	const{userRole} = useSelector((state)=>state.auth)

	if (userRole !== "admin") {
		message.info("Please Login To The Admin Panel")
		message.destroy("what")
		return <Navigate to="/login" />;
	}
	return <Outlet />;
};

export default AdminProtectedRoute;
