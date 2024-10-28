import React, { createContext, useEffect, useState } from "react";
import { message } from "antd";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [token, setToken] = useState(null);
	const [role, setRole] = useState(null);
	const [messageApi, contextHolder] = message.useMessage();


	const apiurl = "http://localhost:8000";
	// const apiurl = process.env.REACT_APP_API_URL;
	// const apiurl = "http://192.168.0.114:8000";

	useEffect(() => {
		const storedToken = localStorage.getItem("cndufabrics_token");
		const storedRole = localStorage.getItem("cndufabrics_role");
		if (storedToken&& storedRole) {
			setToken(storedToken);
			setRole(storedRole)
		} else {
			const sessionRole = sessionStorage.getItem("cndufabrics_role");
			const sessionToken = sessionStorage.getItem("cndufabrics_token");
			if (sessionToken && sessionRole) {
				setToken(sessionToken);
				setRole(sessionRole);
			}
		}
		setIsLoading(false);
	}, []);

	const handleLogin = (token,role) => {
		setToken(token);
		setRole(role);
		localStorage.setItem("cndufabrics_role", role);
		localStorage.setItem("cndufabrics_token", token);
	};

	const handleSessionLogin = (token) => {
		setToken(token);
		setRole(role);
		sessionStorage.setItem("cndufabrics_role", role);
		sessionStorage.setItem("cndufabrics_token", token);
	};

	const handleLogout = () => {
		setToken(null);
		setRole(null);
		localStorage.removeItem("cndufabrics_role");
		sessionStorage.removeItem("cndufabrics_role");
		localStorage.removeItem("cndufabrics_token");
		sessionStorage.removeItem("cndufabrics_token");
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<UserContext.Provider
			value={{
				handleLogin,
				handleSessionLogin,
				handleLogout,
				token,
				apiurl,
				role
			}}>
			{contextHolder}
			{children}
		</UserContext.Provider>
	);
};
