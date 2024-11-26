import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons"; // Import Ant Design Logo Icon
import "./Header.css";
import { useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [selectedKey, setSelectedKey] = useState("home");
  const access_token=sessionStorage.getItem("access_token");


  // Update `selectedKey` based on the current path
  useEffect(() => {
    const path = location.pathname.split("/")[1]; // Get the first part of the path
    setSelectedKey(path || "home"); // Default to "home" if the path is empty
  }, [location.pathname]);

  const handleMenuClick = (e) => {
    setSelectedKey(e.key); // Update active menu item
    if (e.key === "collections" || e.key === "contacts") {
      console.log(`${e.key} page coming soon`);
    } else {
      navigate(`/${e.key === "home" ? "" : e.key}`);
    }
  };
  const [searchTerm, setSearchTerm] = useState('');

  console.log("searchTerm",searchTerm)

  const handleChange = (e) => {
    setSearchTerm(e.target.value); // Update the state with the new value
  };
  const handleSearch=()=>{
console.log("dhinni compare chy ",
  searchTerm

)
  }
  return (
    <Layout.Header className="custom_header">
      {/* Logo Section */}
      <div className="header-logo">
        <img src="/logo.png" alt="Logo" className="logo-image" />
        <AntDesignOutlined className="ant-design-logo" />
      </div>

      {/* Navigation Links */}
      <Menu
        mode="horizontal"
        className="header-nav"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items={[
          { key: "home", label: <Link to="/">Home</Link> },
          { key: "fabrics", label: <Link to="/fabrics">Fabrics</Link> },
          {
            key: "collections",
            label: <Link to="/CNDUCollections">CNDUCollecnctions</Link>,
          },
          { key: "products", label: <Link to="/products">Products</Link> },
          { key: "contacts", label: <Link to="/contacts">Contacts</Link> },
        ]}
      />

      {/* Icon and Label Section */}
      <div className="header-icons">
        {/* Search Icon */}
        <div className="icon-item">
          <input placeholder="Search " style={{backgroundColor:"#fbf9f9",border:"none",borderRadius:"10px",outline:"none",textIndent:"10px",height:"30px"}} onChange={handleChange}/>
          <img src="/SearchIcon.svg" alt="Search" className="icons" onClick={handleSearch} />
          {/* <span>Search</span> */}
        </div>
        {/* Cart Icon */}
        <div className="icon-item">
          <img
            src="/CartIcon.svg"
            alt="Cart"
            className="icons"
            onClick={() => navigate("/cart")}
          />
          <span>Cart</span>
        </div>
        {/* Profile Section */}
        {access_token? (
          <div className="profile-icon">
            <UserOutlined
              className="profile-icon-ant"
              style={{ fontSize: "24px",width:"25px",marginLeft:"5px" }} // You can adjust the font size to control the icon size
              onClick={() => navigate("/profile")}
            />
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </Layout.Header>
  );
};

export default Header;
