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
import AdminDashBoard from "./components/admin/AdminDashBoard";
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
function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset/:uidb64/:token" element={<ResetPasswordForm />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/changePassword" element={<ResetPasswordForm />} />
      <Route path="/footer" element={<Footer />}></Route>
      <Route path="/check" element={<Check/>}></Route>
      <Route path="/dealcard" element={<Specialdealscard/>}></Route>
      <Route path="/heading" element={<Heading/>}></Route>




      {/* Protected Route for authenticated users */}
      <Route element={<ProtectedRoute />}>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/Home/product/:id" element={<SpecificProductpage />} />
        <Route path="/cart" element={<Cart />}></Route>
      <Route path="/products" element={<Productpagebody />}></Route>

        <Route path="/wishlist" element={<WishList />} />
        <Route path="/orders" element={<Orders />}></Route>
        <Route path="/orders/:id" element={<Orderpage />}></Route>
        <Route path="/outfits" element={<UsersOutfits/>}></Route>
        </Route>
      </Route>
      {/* Admin Protected Route for admin-only access */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/adminDashboard" element={<AdminDashBoard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/addoutfit" element={<AddOutfit />}></Route>
        <Route path="/inventory/product/:id" element={<Productpage />} />
        <Route
          path="/inventory/product/edit/:id"
          element={<UpdateProduct />}
        ></Route>
        <Route path="/adminoutfits" element={<Outfits />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
