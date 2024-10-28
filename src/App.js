import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import ForgotPassword from "./components/PasswordManagement/Forgot";
import ResetPasswordForm from "./components/PasswordManagement/Reset";
import Success from "./components/PasswordManagement/Success";
import { AdminAuthRoute } from "./components/utils/AdminAuthRoute";
import { AuthRoute } from "./components/utils/AuthRoute";
import AdminMetrics from "./components/Management/Home";

function App() {
	return (
		<Routes>
			{/* <Route path="/" element={<Home />}></Route> */}
			<Route path="/login" element={<Login />} />
			<Route
				path="/reset/:uidb64/:token"
				element={<ResetPasswordForm />}></Route>
			<Route path="/forgot" element={<ForgotPassword />}></Route>
			<Route path="/signup" element={<Signup />} />
			<Route path="/" element={<AdminAuthRoute />}>
				<Route path="/admin/home" element={<AdminMetrics />}></Route>
			</Route>
			<Route path="/" element={<AuthRoute />}></Route>
		</Routes>
	);
}

export default App;
