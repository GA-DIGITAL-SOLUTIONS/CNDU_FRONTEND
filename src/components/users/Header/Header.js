import React from "react";
import { Layout, Menu, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons"; // Only import ShoppingCartOutlined since we are using SVG for search
import "./Header.css";
import { Link } from "react-router-dom";


const Header = () => {
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
        items={[
          { key: "home", label: <Link to="/">Home</Link> },
          { key: "fabrics", label: "Fabrics" },
          { key: "collections", label: "CNDU Collections" },
          { key: "products", label: <Link to="/products">Products</Link> },
          { key: "contacts", label: "Contacts" },
        ]}
      />

      {/* Icon and Label Section */}
      <div className="header-icons">  
        <div className="icon-item">
          {/* Using the SVG file from the public folder */}
          <img src="/SearchIcon.svg" alt="Search" className="icons" />
          <span>Search</span>
        </div>
        <div className="icon-item">
        <img src="/CartIcon.svg" alt="Cart" className="icons" />
       
          <span>Cart</span>
        </div>
        <button className="login-btn">Login</button>
      </div>
    </Layout.Header>
  );
};

export default Header;
