import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [selectedKey, setSelectedKey] = useState("home");
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    setSelectedKey(e.key); // Update active menu item
    if (e.key === "collections" || e.key === "contacts") {
      console.log(`${e.key} page coming soon`);
    } else {
      navigate(`/${e.key === "home" ? "" : e.key}`);
    }
  };

  return (
    <Layout.Header className="custom_header">
      {/* Logo Section */}
      <div className="header-logo">
        <img src="/logo.png" alt="Logo" className="logo-image" />
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
          { key: "collections", label: "CNDU Collections" },
          { key: "products", label: <Link to="/products">Products</Link> },
          { key: "contacts", label: "Contacts" },
        ]}
      />

      {/* Icon and Label Section */}
      <div className="header-icons">
        <div className="icon-item">
          <img src="/SearchIcon.svg" alt="Search" className="icons" />
          <span>Search</span>
        </div>
        <div className="icon-item">
          <img
            src="/CartIcon.svg"
            alt="Cart"
            className="icons"
            onClick={() => navigate("/cart")}
          />
          <span>Cart</span>
        </div>
        <button className="login-btn">Login</button>
      </div>
    </Layout.Header>
  );
};

export default Header;
