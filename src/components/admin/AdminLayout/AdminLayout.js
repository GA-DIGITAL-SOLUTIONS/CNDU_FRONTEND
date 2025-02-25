import React, { useEffect, useState } from "react";
import { Badge, Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  DeploymentUnitOutlined,
  ShoppingOutlined,
  UndoOutlined,
  DollarCircleOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import "./AdminLayout.css";
import logo from "./adminnavlogo.svg";
import { fetchOrders } from "../../../store/orderSlice";
import { useDispatch, useSelector } from "react-redux";

const { Header, Sider } = Layout;

const Main = ({ children }) => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [normalOrdersCount, setNormalOrdersCount] = useState(0);
  const [ptypeOrdersCount, setPtypeOrdersCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);

  // Track previous route to show confirmation
  const [previousRoute, setPreviousRoute] = useState(null);

  useEffect(() => {
    // Track the previous location
    setPreviousRoute(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    dispatch(fetchOrders({ apiurl, access_token }));
  }, [dispatch, apiurl, access_token]);

  const { orders } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const falsePTypeOrders = orders.filter(
        (order) => order?.items[0]?.p_type === false
      );
      const ptypeOrders = orders.filter(
        (order) => order?.items[0]?.p_type === true
      );

      setPtypeOrdersCount(countTodayOrders(ptypeOrders));
      setNormalOrdersCount(countTodayOrders(falsePTypeOrders));

      setFilteredOrders(
        falsePTypeOrders.map((order) => ({
          ...order,
          username: order.user?.username || "N/A",
        }))
      );
    }
  }, [orders]);

  const countTodayOrders = (gettingorders) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayDateString = `${year}-${month}-${day}`;

    const todayOrders = gettingorders?.filter((order) => {
      const orderDate = new Date(order.created_at);
      const orderYear = orderDate.getFullYear();
      const orderMonth = String(orderDate.getMonth() + 1).padStart(2, "0");
      const orderDay = String(orderDate.getDate()).padStart(2, "0");
      const orderDateString = `${orderYear}-${orderMonth}-${orderDay}`;
      return orderDateString === todayDateString;
    });

    return todayOrders.length;
  };

  // Handle tab changes based on selected menu key
  const handleChangeTab = (e) => {
    const selectedKey = e.key;

    // Check if the previous route was 'addproduct' and show a confirmation modal
    if (previousRoute === "/addproduct") {
      Modal.confirm({
        title: "Are you sure?",
        content: "You have unsaved changes. Are you sure you want to leave?",
        onOk: () => navigateTo(selectedKey),
        onCancel: () => {},
      });
    } else {
      navigateTo(selectedKey); // Navigate without confirmation
    }
  };

  const navigateTo = (selectedKey) => {
    switch (selectedKey) {
      case "1":
        navigate("/dashboard");
        break;
      case "2":
        navigate("/inventory");
        break;
      case "3":
        navigate("/admincombinations");
        break;
      case "4":
        navigate("/addproduct");
        break;
      case "5":
        navigate("/adminorders");
        break;
      case "6":
        navigate("/preorders");
        break;
      case "7":
        navigate("/adminreturns");
        break;
      case "8":
        navigate("/discounts");
        break;
      case "9":
        navigate("/adminreviews");
        break;
      case "10":
        navigate("/newsletter");
        break;
      case "11":
        navigate("/notifications");
        break;
      default:
        break;
    }
  };

  // Map paths to their corresponding keys
  const menuKeys = {
    "/dashboard": "1",
    "/inventory": "2",
    "/admincombinations": "3",
    "/addproduct": "4",
    "/adminorders": "5",
    "/preorders": "6",
    "/adminreturns": "7",
    "/discounts": "8",
    "/adminreviews": "9",
    "/newsletter": "10",
    "/notifications": "11",
  };

  // Update selected tab based on location.pathname
  const [currentKey, setCurrentKey] = useState(menuKeys[location.pathname] || "1");

  useEffect(() => {
    setCurrentKey(menuKeys[location.pathname] || ""); // Dynamically set the selected tab
  }, [location.pathname]);

  return (
    <Layout>
      <Sider
        className="side"
        breakpoint="md"
        collapsedWidth="0"
        width={"225px"}
        style={{
          height: "calc(100vh - 100px)",
          position: "fixed",
          left: "0",
          top: "100px",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={[currentKey]} // Dynamically set selected key
          onSelect={handleChangeTab}
          className="menu"
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
          <Menu.Item key="2" icon={<ShoppingCartOutlined />}>Inventory</Menu.Item>
          <Menu.Item key="3" icon={<DeploymentUnitOutlined />}>Combination</Menu.Item>
          <Menu.Item key="4" icon={<AppstoreOutlined />}>Add Product</Menu.Item>
          <Menu.Item key="5" icon={<ShoppingOutlined />}>
            Orders
            <Badge
              count={normalOrdersCount}
              style={{ backgroundColor: "black", color: "white" }}
              offset={[50, 0]}
            />
          </Menu.Item>
          <Menu.Item key="6" icon={<ShoppingOutlined />}>
            PreOrders
            <Badge
              count={ptypeOrdersCount}
              style={{ backgroundColor: "black", color: "white" }}
              offset={[18, 0]}
            />
          </Menu.Item>
          <Menu.Item key="7" icon={<UndoOutlined />}>Returns</Menu.Item>
          <Menu.Item key="8" icon={<DollarCircleOutlined />}>Discounts</Menu.Item>
          <Menu.Item key="9" icon={<DollarCircleOutlined />}>Reviews</Menu.Item>
          <Menu.Item key="10" icon={<DollarCircleOutlined />}>Newsletter</Menu.Item>
          <Menu.Item key="11" icon={<NotificationOutlined />}>Notifications</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="head">
          <div className="header-logo">
            <a href="/">
              <img alt="logo" src={logo} />
            </a>
          </div>
        </Header>

        <div className="content">{children}</div>
      </Layout>
    </Layout>
  );
};

export default Main;
