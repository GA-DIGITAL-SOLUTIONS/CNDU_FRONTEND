// src/components/ProtectedRoute.js
import React from "react";
import { useSelector } from "react-redux";
// import { verifyToken, logout } from "../store/authSlice";
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
		return <Navigate to="/login" />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
