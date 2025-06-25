
import React, { useEffect, useState } from "react";
import { Layout, Menu, Drawer, Button } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Badge } from "antd";
import {
  DiscordOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./Header.css";
import { searchProducts } from "../../../store/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems, updateCartCount } from "../../../store/cartSlice";
import mobilebtn from '../Body/bannerimages/menbtn.svg'

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("home");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItemsCount, setcartItemsCount] = useState(3);
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { items, cartCount } = useSelector((state) => state.cart);

  // console.log("cartitme", items?.items?.length);

  const dispatch = useDispatch();

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setSelectedKey(path || "home");
  }, [location.pathname]);

  useEffect(() => {
    // console.log("Fetching the cart items");
    if(access_token){
       dispatch(fetchCartItems({ apiurl, access_token }))
      .unwrap()
      .then((result) => {
        // console.log("Cart items fetched successfully:", result);
      })
      .catch((error) => {
        // console.error("Error fetching cart items:", error);
      });

    }
   
  }, [dispatch, apiurl, access_token]);

  const handleMenuClick = (e) => {
    if (e.key !== "search") {
      setSelectedKey(e.key);
      setIsDrawerOpen(false);
    }
  };

  const handleSearch = () => {
    if(searchTerm!=""){
 navigate(`/search/${searchTerm}`);
    // console.log("Search Term:", searchTerm);
    setIsDrawerOpen(false);  // Close the drawer after searching
    }
   
  };

  // console.log("Header is running man so show that badge number");

  const handleKeyPress = (event) => {
    if(searchTerm!=""){

    if (event.key === "Enter") {
      navigate(`/search/${searchTerm}`);
      setIsDrawerOpen(false);  // Close the drawer after pressing Enter
    }
  }
  };

  const menuItems = [
    { key: "fabrics", label: <Link style={{color:"#00000080"}} to="/fabrics">Fabrics</Link> },
    {
      key: "CNDUCollections",
      label: <Link style={{color:"#00000080"}} to="/CNDUCollections">CNDU SpecialCollections</Link>,
    },
    { key: "sarees", label: <Link style={{color:"#00000080"}} to="/sarees">Sarees</Link> },
    {
      key: "combinations",
      label: <Link style={{color:"#00000080"}} to="/combinations">Combinations</Link>,
    },

    { key: "offers", label: <Link style={{color:"#00000080"}} to="/offers">Offers</Link> },
    { key: "dresses", label: <Link style={{color:"#00000080"}} to="/dresses">Dresses</Link> },
    { key: "blouses", label: <Link style={{color:"#00000080"}} to="/blouses">Blouses</Link> },

    {
      key: "cart",
      label: (
        <Link to="/cart" style={{ display: "flex", alignItems: "center",color:"#00000080" }}>
          {items?.items?.length > 0 ? (
            <Badge
              count={items?.items?.length}
              overflowCount={1000}
              size="medium"
              offset={[-1, 0]}
            >
              <ShoppingCartOutlined style={{ fontSize: "25px" }} />
            </Badge>
          ) : (
            <ShoppingCartOutlined style={{ fontSize: "25px" }} />
          )}
          <span style={{ marginLeft: 8 }}>Cart</span>
        </Link>
      ),
    },

    {
      key: "profile",
      label: access_token ? (
        <Link to="/profile" style={{color:"#00000080"}}>
          <UserOutlined />
        </Link>
      ) : (
        <Link to="/login"  style={{color:"#00000080"}}>Login</Link>
      ),
    },
    {
      key: "search",
      label: (
        <div className="icon-item">
          <input
            placeholder="Search"
            style={{
              backgroundColor: "#fbf9f9",
              border: "none",
              borderRadius: "10px",
              outline: "none",
              textIndent: "10px",
              height: "30px",
              color: "black",
              width: "80%",
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <img
            src="/SearchIcon.svg"
            alt="Search"
            className="icons"
            onClick={handleSearch}
            style={{ marginLeft: "10px", cursor: "pointer" }}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout.Header className="custom_header">
      <Link to="/">
        <div className="header-logo">
          <img src="/logo.png" alt="Logo" className="logo-image" />
        </div>
      </Link>

      {/* <Button
        className="mobile-menu-button"
        icon={<MenuOutlined />}
        onClick={() => setIsDrawerOpen(true)}
      /> */}
      <img src={mobilebtn} className="mobile-menu-button"
        onClick={() => setIsDrawerOpen(true)}
      ></img>


      <Drawer
        className="custom-drawer"
        title="Menu"
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <Menu
          style={{ borderInlineEnd: "none" }}
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Drawer>

      <Menu
        mode="horizontal"
        className="header-nav desktop-nav"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items={menuItems}
      />
    </Layout.Header>
  );
};

export default Header;

