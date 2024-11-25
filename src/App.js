import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import ForgotPassword from "./components/PasswordManagement/Forgot";
import Success from "./components/PasswordManagement/Success";
import { AdminAuthRoute } from "./components/utils/AdminAuthRoute";
import { AuthRoute } from "./components/utils/AuthRoute";
import AdminMetrics from "./components/Management/Home";
import Test2 from "./components/User/Test2";
import AdminProtectedRoute from "./components/Authentication/AdminProtectedRoute";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import ResetPasswordForm from "./components/PasswordManagement/Change";
import Productpage from "./components/admin/Productpage";
import Inventory from "./components/admin/Inventory";
import UpdateProduct from "./components/admin/UpdateProduct";
import Home from "./components/users/Home";
import Product from "./components/users/Product";
import Cart from "./components/users/Cart";
import WishList from "./components/users/WishList";
import Orders from "./components/users/Orders";
import Header from "./components/users/Header/Header";
import MainLayout from "./components/users/Layout/MainLayout";
import Orderpage from "./components/users/Orderpage";
import Outfits from "./components/admin/Outfits";
import AddOutfit from "./components/admin/AddOutfit";
import UsersOutfits from "./components/users/UsersOutfits";
import Footer from "./components/users/Footer/Footer";
import Productpagebody from "./components/users/Productspage/Body/Productpagebody";
import Check from "./components/users/Productspage/Body/Check";
import Specialdealscard from "./components/users/cards/Specialdealscard";
// import Productpage from "./components/users/Specificproductpage.js/Productpage";
import SpecificProductpage from "./components/users/Specificproductpage/SpecificProductpage";
import Heading from "./components/users/Heading/Heading";
import Fabricspage from "./components/users/Fabrics/Fabricspage";
import FabricSpecificPage from "./components/users/FabricSpecific/FabricSpecificPage";
import OrdersAdmin from "./components/admin/OrdersAdmin";
import Reset from "./components/PasswordManagement/Reset";
import CheckForm from "./components/admin/CheckForm";
import Profile from "./components/users/Profile/Profile";
import Discounts from "./components/admin/Discounts";
import PaymentForm from "./components/users/PaymentForm";
import PaymentSuccessfull from "./components/users/PaymentSuccesfull";
import AdminDashboard from "./components/admin/AdminDashboard/AdminDashBoard";
import AdminLayout from "./components/admin/AdminLayout/AdminLayout";
import AdminGraph from "./components/admin/AdminDashboard/Admingraph/AdminGraph";

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset/:uidb64/:token" element={<Reset />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/changePassword" element={<ResetPasswordForm />} />
      <Route path="/footer" element={<Footer />}></Route>
      <Route path="/check" element={<CheckForm />}></Route>
      <Route path="/dealcard" element={<Specialdealscard />}></Route>
      <Route path="/heading" element={<Heading />}></Route>

      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/fabrics" element={<Fabricspage />}></Route>
        <Route path="/fabrics/:id" element={<FabricSpecificPage />} />
        <Route path="/products" element={<Productpagebody />}></Route>
        <Route path="/product/:id" element={<SpecificProductpage />} />
      </Route>
      {/* Protected Route for authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/Home/product/:id" element={<SpecificProductpage />} /> */}
          <Route path="/payment" element={<PaymentForm />} />
          <Route path="/paymentSuccess" element={<PaymentSuccessfull />} />
          {/* <Route path="/fabrics/:id" element={<FabricSpecificPage />} /> */}
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/fabrics" element={<Fabricspage />}></Route>
          <Route path="/fabrics/:id" element={<FabricSpecificPage />} />
          <Route path="/products" element={<Productpagebody />}></Route>
          <Route path="/product/:id" element={<SpecificProductpage />} />
          {/* <Route path="/fabrics" element={<Fabricspage />}></Route> */}
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/orders" element={<Orders />}></Route>
          <Route path="/orders/:id" element={<Orderpage />}></Route>
          <Route path="/outfits" element={<UsersOutfits />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Route>
      </Route>
      {/* Admin Protected Route for admin-only access */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route path="/DashBoard" element={<AdminDashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="/discounts" element={<Discounts />} />
          <Route path="/graph" element={<AdminGraph />} />

          <Route
            path="/inventory/product/edit/:id"
            element={<UpdateProduct />}
          ></Route>

          <Route path="/addoutfit" element={<AddOutfit />}></Route>
          <Route path="/inventory/product/:id" element={<Productpage />} />

          <Route path="/adminoutfits" element={<Outfits />}></Route>
          <Route path="/adminorders" element={<OrdersAdmin />}></Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
