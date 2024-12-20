import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Loader/Loader";
import { logout } from "../../store/authSlice";
const ProtectedRoute = () => {
  const { userRole, access_token,apiurl } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const dispatch = useDispatch();

console.log("apiurl",apiurl)

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
        throw new Error("Token verification failed");
      }
      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      dispatch(logout());
      message.error("Token expired! Please login again.");
      return false;
    }
  };

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (access_token) {
        const isValid = await verifyToken(access_token);
        setIsValidToken(isValid);
      }
      setIsLoading(false);
    };

    checkTokenValidity();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!isValidToken || userRole !== "user") {
    message.info("Please login.");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
