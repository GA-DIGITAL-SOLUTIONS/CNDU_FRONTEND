// src/components/AdminProtectedRoute.js
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const access_token=sessionStorage.getItem("access_token")
  const userRole=sessionStorage.getItem("userRole")

  if ( userRole !== "admin") {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
