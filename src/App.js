import "./App.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, Suspense, lazy } from "react";

// --- Synchronous Imports (Keep in main bundle — needed for immediate/first paint) ---
// ⚡ Only minimal imports here to keep main bundle < 100KB
import MainLayout from "./components/users/Layout/MainLayout";
// Header is now lazy-loaded inside MainLayout to save 100KB+

// ✅ CSS-only imports — loads styles synchronously without pulling in the JS components
// This fixes UI breakage on all pages while the main JS components lazy-load
import "./components/users/Productspage/Body/Productpagebody.css";
import "./components/users/Specificproductpage/SpecificProductpage.css";
import "./components/users/FabricSpecific/FabricSpecificPage.css";
import "./components/users/Body/Section2/Section2.css";
import "./components/users/Body/Section3/Section3.css";
import "./components/users/Body/Section4/Section4.css";
import "./components/users/Body/Section5/Section5.css";
import "./components/users/Footer/Footer.css";
import "./components/users/Heading/Heading.css";
import "./components/policies/TermsAndConditions.css";
import "./components/users/Profile/style.css";


// --- Lazy Load Components (Split into small chunks, only loaded when needed) ---
const Login = lazy(() => import("./components/Authentication/Login"));
const Signup = lazy(() => import("./components/Authentication/Signup"));
const Offerspage = lazy(() => import("./components/users/Offerspages/Offerspage"));
const Fabricspage = lazy(() => import("./components/users/Fabrics/Fabricspage"));
const FabricSpecificPage = lazy(() => import("./components/users/FabricSpecific/FabricSpecificPage"));
const SpecificProductpage = lazy(() => import("./components/users/Specificproductpage/SpecificProductpage"));
const Productpagebody = lazy(() => import("./components/users/Productspage/Body/Productpagebody"));
const ForgotPassword = lazy(() => import("./components/PasswordManagement/Forgot"));
const ProductPage = lazy(() => import("./components/admin/Productpage"));
const AdminProtectedRoute = lazy(() => import("./components/Authentication/AdminProtectedRoute"));
const ProtectedRoute = lazy(() => import("./components/Authentication/ProtectedRoute"));
const ResetPasswordForm = lazy(() => import("./components/PasswordManagement/Change"));
const Inventory = lazy(() => import("./components/admin/Inventory"));
const UpdateProduct = lazy(() => import("./components/admin/UpdateProduct"));
const Cart = lazy(() => import("./components/users/Cart/Cart"));
const WishList = lazy(() => import("./components/users/WishList"));
const Orders = lazy(() => import("./components/users/Orders"));
const Outfits = lazy(() => import("./components/admin/Outfits"));
const AddOutfit = lazy(() => import("./components/admin/AddOutfit"));
const UsersOutfits = lazy(() => import("./components/users/UsersOutfits"));
const Specialdealscard = lazy(() => import("./components/users/cards/Specialdealscard"));
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
const AdminOrder = lazy(() => import("./components/admin/AdminDashboard/AdminOrder/AdminOrder"));
const Combinations = lazy(() => import("./components/users/Combinations/Combinations"));
const SpecificCombinationsPage = lazy(() => import("./components/users/Combinations/SpecificCombinationsPage"));
const AdminCombos = lazy(() => import("./components/admin/Combination/AdminCombos"));
const AdminSpecificCombopage = lazy(() => import("./components/admin/Combination/AdminSpecificCombopage"));
const Addproduct = lazy(() => import("./components/admin/Addproduct"));
const ReviewsComponent = lazy(() => import("./components/admin/Reviews"));
const ReturnsComponent = lazy(() => import("./components/admin/Returns"));
const PrivacyPolicy = lazy(() => import("./components/policies/PrivacyPolicy"));
const Orderpage = lazy(() => import("./components/users/orders/Orderpage"));
const ReturnOrderpage = lazy(() => import("./components/users/ReturnOrderPage/ReturnOrderpage"));
const CancellationPolicy = lazy(() => import("./components/policies/CancellationPolicy"));
const ReturnPolicy = lazy(() => import("./components/policies/ReturnPolicy"));
const RefundPolicy = lazy(() => import("./components/policies/RefundPolicy"));
const Newsletter = lazy(() => import("./components/admin/Newsletter"));
const Dresses = lazy(() => import("./components/users/Dresses/Dresses"));
const Contactus = lazy(() => import("./components/users/ContactUs/Contactus"));
const Aboutus = lazy(() => import("./components/users/aboutus/Aboutus"));
const PrebookingOrders = lazy(() => import("./components/admin/PrebookingOrders"));
const Blouses = lazy(() => import("./components/users/Blouses/Blouses"));
const Notifications = lazy(() => import("./components/admin/Notifitcations/Notifications"));
const PhonepeStatus = lazy(() => import("./components/users/PHONEPE/PhonepeStatus"));
const TrackOrder = lazy(() => import("./components/users/TrackOrder/TrackOrder"));
const Footer = lazy(() => import("./components/users/Footer/Footer"));
const Heading = lazy(() => import("./components/users/Heading/Heading"));
const TermsAndConditions = lazy(() => import("./components/policies/TermsAndConditions"));
const Home = lazy(() => import("./components/users/Home"));

// ⚡ FIXED: Wraps ONLY the lazy page content — keeps Header + Footer visible
// This prevents the entire screen from going blank during navigation
const SuspensePage = ({ children }) => (
	<Suspense fallback={null}>
		{children}
	</Suspense>
);

function App() {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	return (
		<Suspense fallback={null}>
		<Routes>
			{/* These pages load without header/footer — each gets its own Suspense */}
			<Route path="/login" element={<SuspensePage><Login /></SuspensePage>} />
			<Route path="/fetchestimates" element={<SuspensePage><FetchCostEstimates /></SuspensePage>} />
			<Route path="/reset/:uidb64/:token" element={<SuspensePage><Reset /></SuspensePage>} />
			<Route path="/forgot" element={<SuspensePage><ForgotPassword /></SuspensePage>} />
			<Route path="/signup" element={<SuspensePage><Signup /></SuspensePage>} />
			<Route path="/changePassword" element={<ResetPasswordForm />} />
			<Route path="/footer" element={<SuspensePage><Footer /></SuspensePage>}></Route>
			<Route path="/check" element={<CheckForm />}></Route>
			<Route path="/dealcard" element={<Specialdealscard />}></Route>
			<Route path="/heading" element={<SuspensePage><Heading /></SuspensePage>}></Route>
			<Route path='/trackOrder/:orderId' element={<TrackOrder />}></Route>

			<Route path="/" element={<MainLayout />}>
				<Route path="/dresses" element={<SuspensePage><Dresses /></SuspensePage>}></Route>
				<Route path="/" element={<SuspensePage><Home /></SuspensePage>} />
				<Route path="/terms-and-conditions" element={<SuspensePage><TermsAndConditions /></SuspensePage>} />
				<Route path="/privacypolicy" element={<SuspensePage><PrivacyPolicy /></SuspensePage>} />
				<Route path="/cancellationpolicy" element={<SuspensePage><CancellationPolicy /></SuspensePage>} />
				<Route path="/returnpolicy" element={<SuspensePage><ReturnPolicy /></SuspensePage>} />
				<Route path="/refundpolicy" element={<SuspensePage><RefundPolicy /></SuspensePage>} />
				<Route path="/contact" element={<SuspensePage><Contactus /></SuspensePage>} />
				<Route path="/about" element={<SuspensePage><Aboutus /></SuspensePage>} />
				<Route path="/blouses" element={<SuspensePage><Blouses /></SuspensePage>} />
				<Route path="/offers" element={<SuspensePage><Offerspage /></SuspensePage>}></Route>
				<Route path="/fabrics" element={<SuspensePage><Fabricspage /></SuspensePage>}></Route>
				<Route path="/fabrics/:id" element={<SuspensePage><FabricSpecificPage /></SuspensePage>} />
				<Route path="/sarees" element={<SuspensePage><Productpagebody /></SuspensePage>}></Route>
				<Route path="/CNDUCollections" element={<SuspensePage><CNDUCollections /></SuspensePage>}></Route>
				<Route path="/search/:searchterm" element={<SuspensePage><SeachComponent /></SuspensePage>} />
				<Route path="/:pagetype/:id" element={<SuspensePage><SpecificProductpage /></SuspensePage>} />
				<Route path="/combinations" element={<SuspensePage><Combinations /></SuspensePage>}></Route>
				<Route path="/combinations/:id" element={<SuspensePage><SpecificCombinationsPage /></SuspensePage>}></Route>
			</Route>

			<Route element={<ProtectedRoute />}>
				<Route path="/" element={<MainLayout />}>
					<Route path="/" element={<SuspensePage><Home /></SuspensePage>} />
					<Route path="/payment" element={<SuspensePage><PaymentForm /></SuspensePage>} />
					<Route path="/paymentSuccess" element={<SuspensePage><PaymentSuccessfull /></SuspensePage>} />
					<Route path="/offers" element={<SuspensePage><Offerspage /></SuspensePage>}></Route>
					<Route path="/cart" element={<SuspensePage><Cart /></SuspensePage>}></Route>
					<Route path="/fabrics" element={<SuspensePage><Fabricspage /></SuspensePage>}></Route>
					<Route path="/search/:searchterm" element={<SuspensePage><SeachComponent /></SuspensePage>} />
					<Route path="/fabrics/:id" element={<SuspensePage><FabricSpecificPage /></SuspensePage>} />
					<Route path="/products" element={<SuspensePage><Productpagebody /></SuspensePage>}></Route>
					<Route path="/wishlist" element={<SuspensePage><WishList /></SuspensePage>} />
					<Route path="/orders" element={<Orders />}></Route>
					<Route path="/dresses" element={<Dresses />}></Route>
					<Route path="/returnpage/:id" element={<ReturnOrderpage />}></Route>
					<Route path="/orders/:id" element={<Orderpage />}></Route>
					<Route path="/outfits" element={<UsersOutfits />}></Route>
					<Route path="/profile" element={<UserAccount />}></Route>
					<Route path="/phonepe/status/:marchant_trx_id" element={<PhonepeStatus />}></Route>
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
