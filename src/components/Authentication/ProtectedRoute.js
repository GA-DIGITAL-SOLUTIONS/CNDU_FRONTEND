// src/components/ProtectedRoute.js
import React from "react";
import { useSelector } from "react-redux";
// import { verifyToken, logout } from "../store/authSlice";
import { message } from "antd";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
	const {userRole}=useSelector((state)=>state.auth)
	// const dispatch = useDispatch();

	// useEffect(() => {
	//   if (token) {
	//     dispatch(verifyToken(token));
	//   } else {
	//     dispatch(logout());
	//   }
	// }, [dispatch, token]);

	if (userRole !== "user") {
		message.info("Please Login  ")
		return <Navigate to="/login" />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
