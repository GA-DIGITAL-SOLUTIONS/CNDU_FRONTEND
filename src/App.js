import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import ForgotPassword from "./components/PasswordManagement/Forgot";
import AdminProtectedRoute from "./components/Authentication/AdminProtectedRoute";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import ResetPasswordForm from "./components/PasswordManagement/Change";
// import Productpage from "./components/admin/Productpage";
import Inventory from "./components/admin/Inventory";
import UpdateProduct from "./components/admin/UpdateProduct";
import Home from "./components/users/Home";
import Cart from "./components/users/Cart/Cart";
import WishList from "./components/users/WishList";
import Orders from "./components/users/Orders";
import MainLayout from "./components/users/Layout/MainLayout";
// import Orderpage from "./components/users/Orderpage";
import Outfits from "./components/admin/Outfits";
import AddOutfit from "./components/admin/AddOutfit";
import UsersOutfits from "./components/users/UsersOutfits";
import Footer from "./components/users/Footer/Footer";
import Productpagebody from "./components/users/Productspage/Body/Productpagebody";
import Specialdealscard from "./components/users/cards/Specialdealscard";
// import Productpage from "./components/users/Specificproductpage.js/Productpage";
import SpecificProductpage from "./components/users/Specificproductpage/SpecificProductpage";
import Heading from "./components/users/Heading/Heading";
import Fabricspage from "./components/users/Fabrics/Fabricspage";
import FabricSpecificPage from "./components/users/FabricSpecific/FabricSpecificPage";
import OrdersAdmin from "./components/admin/OrdersAdmin";
import Reset from "./components/PasswordManagement/Reset";
import CheckForm from "./components/admin/CheckForm";
import Profile from "./components/users/Profile/Address";
import Discounts from "./components/admin/Discounts";
import PaymentForm from "./components/users/PaymentForm";
import PaymentSuccessfull from "./components/users/PaymentSuccesfull";
import AdminDashboard from "./components/admin/AdminDashboard/AdminDashBoard";
import AdminLayout from "./components/admin/AdminLayout/AdminLayout";
import AdminGraph from "./components/admin/AdminDashboard/Admingraph/AdminGraph";
import CNDUCollections from "./components/users/CNDUCollections/CNDUCollections";
import { useLocation } from "react-router-dom";
import AntdSteps from "./Steps/Steps";
import react, { useEffect } from "react";
import FetchCostEstimates from "./components/users/cards/Estimations";
import UserAccount from "./components/users/Profile/Main";
import SeachComponent from "./components/users/search/Search";
import Header from "./components/users/Header/Header";
import ProductPage from "./components/admin/Productpage";
import AdminOrder from "./components/admin/AdminDashboard/AdminOrder/AdminOrder";
import Combinations from "./components/users/Combinations/Combinations";
import SpecificCombinationsPage from "./components/users/Combinations/SpecificCombinationsPage";
import AdminCombos from "./components/admin/Combination/AdminCombos";
import AdminSpecificCombopage from "./components/admin/Combination/AdminSpecificCombopage";
import Addproduct from "./components/admin/Addproduct";
import ReviewsComponent from "./components/admin/Reviews";
import ReturnsComponent from "./components/admin/Returns";
import TermsAndConditions from "./components/policies/TermsAndConditions";
import PrivacyPolicy from "./components/policies/PrivacyPolicy";
import Orderpage from "./components/users/orders/Orderpage";
import ReturnOrderpage from "./components/users/ReturnOrderPage/ReturnOrderpage";
import CancellationPolicy from "./components/policies/CancellationPolicy";
import ReturnPolicy from "./components/policies/ReturnPolicy";
import RefundPolicy from "./components/policies/RefundPolicy";
import Newsletter from "./components/admin/Newsletter";
import Offerspage from "./components/users/Offerspages/Offerspage";
import Dresses from "./components/users/Dresses/Dresses";
import Contactus from "./components/users/ContactUs/Contactus";
import Aboutus from "./components/users/aboutus/Aboutus";
import PrebookingOrders from "./components/admin/PrebookingOrders";
import Blouses from "./components/users/Blouses/Blouses";
import Notifications from "./components/admin/Notifitcations/Notifications";

// import TrackOrder from "./components/users/TrackOrder/TrackOrder";
function App() {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0); 
	}, [location]);

	return (
		<Routes>
			<Route path="/login" element={<Login />} />

			<Route path="/fetchestimates" element={<FetchCostEstimates />} />
			<Route path="/reset/:uidb64/:token" element={<Reset />} />
			<Route path="/forgot" element={<ForgotPassword />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/changePassword" element={<ResetPasswordForm />} />
			<Route path="/footer" element={<Footer />}></Route>
			<Route path="/check" element={<CheckForm />}></Route>
			<Route path="/dealcard" element={<Specialdealscard />}></Route>
			<Route path="/heading" element={<Heading />}></Route>
			<Route path="/step" element={<AntdSteps />}></Route>
			{/* <Route path='/trackOrder/:orderId' element={<TrackOrder/>}></Route> */}

			<Route path="/" element={<MainLayout />}>
				<Route path="/dresses" element={<Dresses />}></Route>		
				<Route path="/" element={<Home />} />
				<Route path="/terms-and-conditions" element={<TermsAndConditions />} />
				<Route path="/privacypolicy" element={<PrivacyPolicy />} />
				<Route path="/cancellationpolicy" element={<CancellationPolicy />} />
				<Route path="/returnpolicy" element={<ReturnPolicy />} />
				<Route path="/refundpolicy" element={<RefundPolicy />} />
				<Route path="/contact" element={<Contactus />} />
				<Route path="/about" element={<Aboutus />} />
				<Route path="/blouses" element={<Blouses />} />

				<Route path="/offers" element={<Offerspage />}></Route>

				<Route path="/fabrics" element={<Fabricspage />}></Route>
				<Route path="/fabrics/:id" element={<FabricSpecificPage />} />
				<Route path="/products" element={<Productpagebody />}></Route>
				<Route path="/CNDUCollections" element={<CNDUCollections />}></Route>
				<Route path="/search/:searchterm" element={<SeachComponent />} />
				{/* <Route path="/:pagetype/:id" element={<SpecificProductpage />} /> */}
				<Route path="/:pagetype/:id" element={<SpecificProductpage />} />

				<Route path="/combinations" element={<Combinations />}></Route>
				<Route
					path="/combinations/:id"
					element={<SpecificCombinationsPage />}></Route>
			</Route>
			{/* Protected Route for authenticated users */}
			<Route element={<ProtectedRoute />}>
				<Route path="/" element={<MainLayout />}>
					<Route path="/" element={<Home />} />
					<Route path="/payment" element={<PaymentForm />} />
					<Route path="/paymentSuccess" element={<PaymentSuccessfull />} />
					<Route path="/offers" element={<Offerspage />}></Route>
					<Route path="/cart" element={<Cart />}></Route>
					<Route path="/fabrics" element={<Fabricspage />}></Route>
					<Route path="/search/:searchterm" element={<SeachComponent />} />
					<Route path="/fabrics/:id" element={<FabricSpecificPage />} />
					<Route path="/products" element={<Productpagebody />}></Route>
					{/* <Route path="/products/:id" element={<SpecificProductpage />} /> */}
					<Route path="/wishlist" element={<WishList />} />
					<Route path="/orders" element={<Orders />}></Route>
					<Route path="/dresses" element={<Dresses />}></Route>
					<Route path="/returnpage/:id" element={<ReturnOrderpage />}></Route>
					<Route path="/orders/:id" element={<Orderpage />}></Route>
					<Route path="/outfits" element={<UsersOutfits />}></Route>
					<Route path="/profile" element={<UserAccount />}></Route>
				</Route>
			</Route>
			{/* Admin Protected Route for admin-only access */}
			<Route element={<AdminProtectedRoute />}>
				<Route path="/dashboard" element={<AdminDashboard />} />
				<Route path="/inventory" element={<Inventory />} />
				<Route path="/addproduct" element={<Addproduct />} />
				<Route path="/notifications" element={<Notifications />} />

				<Route path="/discounts" element={<Discounts />} />
				<Route path="/graph" element={<AdminGraph />} />
				<Route path="/adminreviews" element={<ReviewsComponent />} />
				<Route path="/newsletter" element={<Newsletter />} />
				<Route path="/adminreturns" element={<ReturnsComponent />} />
				<Route path="/adminorders/:id" element={<AdminOrder />}></Route>
				<Route path="/preorders/:id" element={<AdminOrder />}></Route>

				<Route
					path="inventory/product/:id/edit/"
					element={<UpdateProduct />}></Route>

				<Route path="/addoutfit" element={<AddOutfit />}></Route>
				<Route path="/inventory/product/:id" element={<ProductPage />} />

				<Route path="/admincombinations" element={<AdminCombos />}></Route>
				<Route
					path="/admincombinations/:id"
					element={<AdminSpecificCombopage />}></Route>
				<Route path="/adminoutfits" element={<Outfits />}></Route>
				<Route path="/adminorders" element={<OrdersAdmin />}></Route>
				<Route path="/preorders" element={<PrebookingOrders />}></Route>
			</Route>
		</Routes>
	);
}

export default App;
