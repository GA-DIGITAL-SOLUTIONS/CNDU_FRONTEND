import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

const LogoutTab = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Function to handle logout action
	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	return (
		<div className="logout_div">
			{/* Ant Design Result component */}
			<Result
				status="warning"
				title="Are you sure you want to log out?"
				extra={
					<Button type="primary" danger onClick={handleLogout}>
						LogOut
					</Button>
				}
			/>
		</div>
	);
};

export default LogoutTab;
