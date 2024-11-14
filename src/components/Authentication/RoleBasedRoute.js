// src/components/RoleBasedRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = () => {
  const access_token =  sessionStorage.getItem("access_token");
  const userRole =   sessionStorage.getItem("userRole");

  if (!access_token) {
    return <Navigate to="/login" />;
  }

  if(userRole=== "admin"){
      return  <Navigate to="/adminDashboard" /> 
  }
  else if(userRole=== "user"){
    return <Navigate to="/userDashboard" />
  }

};

export default RoleBasedRoute;
