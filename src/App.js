import "./App.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, Suspense, lazy } from "react";

// --- Lazy Load Components ---
const Login = lazy(() => import("./components/Authentication/Login"));
const Signup = lazy(() => import("./components/Authentication/Signup"));
const ForgotPassword = lazy(() => import("./components/PasswordManagement/Forgot"));
const AdminProtectedRoute = lazy(() => import("./components/Authentication/AdminProtectedRoute"));
const ProtectedRoute = lazy(() => import("./components/Authentication/ProtectedRoute"));
const ResetPasswordForm = lazy(() => import("./components/PasswordManagement/Change"));
const Inventory = lazy(() => import("./components/admin/Inventory"));
const UpdateProduct = lazy(() => import("./components/admin/UpdateProduct"));
const Home = lazy(() => import("./components/users/Home"));
const Cart = lazy(() => import("./components/users/Cart/Cart"));
const WishList = lazy(() => import("./components/users/WishList"));
const Orders = lazy(() => import("./components/users/Orders"));
const MainLayout = lazy(() => import("./components/users/Layout/MainLayout"));
const Outfits = lazy(() => import("./components/admin/Outfits"));
const AddOutfit = lazy(() => import("./components/admin/AddOutfit"));
const UsersOutfits = lazy(() => import("./components/users/UsersOutfits"));
const Footer = lazy(() => import("./components/users/Footer/Footer"));
const Productpagebody = lazy(() => import("./components/users/Productspage/Body/Productpagebody"));
const Specialdealscard = lazy(() => import("./components/users/cards/Specialdealscard"));
const SpecificProductpage = lazy(() => import("./components/users/Specificproductpage/SpecificProductpage"));
const Heading = lazy(() => import("./components/users/Heading/Heading"));
const Fabricspage = lazy(() => import("./components/users/Fabrics/Fabricspage"));
const FabricSpecificPage = lazy(() => import("./components/users/FabricSpecific/FabricSpecificPage"));
const OrdersAdmin = lazy(() => import("./components/admin/OrdersAdmin"));
const Reset = lazy(() => import("./components/PasswordManagement/Reset"));
const CheckForm = lazy(() => import("./components/admin/CheckForm"));
const Profile = lazy(() => import("./components/users/Profile/Address"));
const Discounts = lazy(() => import("./components/admin/Discounts"));
const PaymentForm = lazy(() => import("./components/users/PaymentForm"));
const PaymentSuccessfull = lazy(() => import("./components/users/PaymentSuccesfull"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard/AdminDashBoard"));
const AdminGraph = lazy(() => import("./components/admin/AdminDashboard/Admingraph/AdminGraph"));
const CNDUCollections = lazy(() => import("./components/users/CNDUCollections/CNDUCollections"));
const FetchCostEstimates = lazy(() => import("./components/users/cards/Estimations"));
const UserAccount = lazy(() => import("./components/users/Profile/Main"));
const SeachComponent = lazy(() => import("./components/users/search/Search"));
const ProductPage = lazy(() => import("./components/admin/Productpage"));
const AdminOrder = lazy(() => import("./components/admin/AdminDashboard/AdminOrder/AdminOrder"));
const Combinations = lazy(() => import("./components/users/Combinations/Combinations"));
const SpecificCombinationsPage = lazy(() => import("./components/users/Combinations/SpecificCombinationsPage"));
const AdminCombos = lazy(() => import("./components/admin/Combination/AdminCombos"));
const AdminSpecificCombopage = lazy(() => import("./components/admin/Combination/AdminSpecificCombopage"));
const Addproduct = lazy(() => import("./components/admin/Addproduct"));
const ReviewsComponent = lazy(() => import("./components/admin/Reviews"));
const ReturnsComponent = lazy(() => import("./components/admin/Returns"));
const TermsAndConditions = lazy(() => import("./components/policies/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./components/policies/PrivacyPolicy"));
const Orderpage = lazy(() => import("./components/users/orders/Orderpage"));
const ReturnOrderpage = lazy(() => import("./components/users/ReturnOrderPage/ReturnOrderpage"));
const CancellationPolicy = lazy(() => import("./components/policies/CancellationPolicy"));
const ReturnPolicy = lazy(() => import("./components/policies/ReturnPolicy"));
const RefundPolicy = lazy(() => import("./components/policies/RefundPolicy"));
const Newsletter = lazy(() => import("./components/admin/Newsletter"));
const Offerspage = lazy(() => import("./components/users/Offerspages/Offerspage"));
const Dresses = lazy(() => import("./components/users/Dresses/Dresses"));
const Contactus = lazy(() => import("./components/users/ContactUs/Contactus"));
const Aboutus = lazy(() => import("./components/users/aboutus/Aboutus"));
const PrebookingOrders = lazy(() => import("./components/admin/PrebookingOrders"));
const Blouses = lazy(() => import("./components/users/Blouses/Blouses"));
const Notifications = lazy(() => import("./components/admin/Notifitcations/Notifications"));
const PhonepeStatus = lazy(() => import("./components/users/PHONEPE/PhonepeStatus"));
const TrackOrder = lazy(() => import("./components/users/TrackOrder/TrackOrder"));

// Loading spinner fallback
const LoadingSpinner = () => (
	<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
		<div className="spinner">Loading...</div>
	</div>
);

function App() {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0); 
	}, [location]);

	return (
		<Suspense fallback={<LoadingSpinner />}>
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
				<Route path='/trackOrder/:orderId' element={<TrackOrder/>}></Route>

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
					<Route path="/sarees" element={<Productpagebody />}></Route>
					<Route path="/CNDUCollections" element={<CNDUCollections />}></Route>
					<Route path="/search/:searchterm" element={<SeachComponent />} />
					<Route path="/:pagetype/:id" element={<SpecificProductpage />} />
					<Route path="/combinations" element={<Combinations />}></Route>
					<Route path="/combinations/:id" element={<SpecificCombinationsPage />}></Route>
				</Route>

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
						<Route path="/wishlist" element={<WishList />} />
						<Route path="/orders" element={<Orders />}></Route>
						<Route path="/dresses" element={<Dresses />}></Route>
						<Route path="/returnpage/:id" element={<ReturnOrderpage />}></Route>
						<Route path="/orders/:id" element={<Orderpage />}></Route>
						<Route path="/outfits" element={<UsersOutfits />}></Route>
						<Route path="/profile" element={<UserAccount />}></Route>
						<Route path="/phonepe/status/:marchant_trx_id" element={<PhonepeStatus/>}></Route>
					</Route>
				</Route>
				
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
					<Route path="inventory/product/:id/edit/" element={<UpdateProduct />}></Route>
					<Route path="/addoutfit" element={<AddOutfit />}></Route>
					<Route path="/inventory/product/:id" element={<ProductPage />} />
					<Route path="/admincombinations" element={<AdminCombos />}></Route>
					<Route path="/admincombinations/:id" element={<AdminSpecificCombopage />}></Route>
					<Route path="/adminoutfits" element={<Outfits />}></Route>
					<Route path="/adminorders" element={<OrdersAdmin />}></Route>
					<Route path="/preorders" element={<PrebookingOrders />}></Route>
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;
