import React, { useEffect, useState } from "react";
import { Badge } from "antd"
import { useLocation, Link, useNavigate } from "react-router-dom";
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
  // const [f, setFilteredOrders] = useState([]);
  const [normalOrdersCount, setNormalOrdersCount] = useState([]);
  const [ptypeOrdersCount, setPtypeOrdersCount] = useState([]);
	const location = useLocation();
	const navigate = useNavigate();
	// const { handleLogout } = useAuth();

	const handleLogoutClick = () => {
		// handleLogout();
		navigate("/login");
	};

	const defaultSelectedKeys = () => {
		const pathname = location.pathname;
		const menuItems = [
			"/dashboard",
			"/inventory",
			"/admincombinations",
			"/addproduct",
			"/adminorders",
			"/preorders",
			"/adminreturns",
			"/discounts",
			"/adminreviews",
			"/newsletter",
			"/notifications"
		];

		const index = menuItems.findIndex((item) => pathname.includes(item));
		return index !== -1 ? [`${index + 1}`] : [""];
	};


	const dispatch=useDispatch()
	const {apiurl,access_token}= useSelector((state)=>state.auth)


	
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

			setPtypeOrdersCount(countTodayOrders(ptypeOrders))

	setNormalOrdersCount(countTodayOrders(filteredOrders))

      setFilteredOrders(
        falsePTypeOrders.map((order) => ({
          ...order,
          username: order.user?.username || "N/A",
        }))
      );
    }
  }, [orders]);

	// console.log("ptypeOrdersCount",ptypeOrdersCount)
	// console.log("normalOrdersCount",normalOrdersCount)

  const countTodayOrders = (gettingorders) => {
		// console.log("getting ORders ",gettingorders)
    const today = new Date(); // Get the current date and time
  
    // Extract today's date in 'YYYY-MM-DD' format
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0");
    const todayDateString = `${year}-${month}-${day}`;
  
    // Filter orders where the local date part of `created_at` matches today's date
    const todayOrders = gettingorders?.filter((order) => {
      const orderDate = new Date(order.created_at); // Parse the `created_at` field
      const orderYear = orderDate.getFullYear();
      const orderMonth = String(orderDate.getMonth() + 1).padStart(2, "0");
      const orderDay = String(orderDate.getDate()).padStart(2, "0");
      const orderDateString = `${orderYear}-${orderMonth}-${orderDay}`;
      return orderDateString === todayDateString; // Compare dates
    });
  
    return todayOrders.length; // Return the count of today's orders
  };
  


	const menuItems = [
		{
			key: "1",
			icon: <DashboardOutlined />,
			label: <Link to="/dashboard">Dashboard</Link>,
		},
		{
			key: "2",
			icon: <ShoppingCartOutlined />,
			label: <Link to="/inventory">Inventory</Link>,
		},

		{
			key: "3",
			icon: <DeploymentUnitOutlined />,
			label: <Link to="/admincombinations">Combination</Link>,
		},
		{
			key: "4",
			icon: <AppstoreOutlined />,
			label: <Link to="/addproduct">Add Product</Link>,
		},
		{
			key: "5",
			icon: <ShoppingOutlined />,
			label:  (
				<>
				<Link to="/adminorders">Orders</Link>
				<Badge count={normalOrdersCount} style={{ backgroundColor: "black", color: "white" }} offset={[-2,0]} >
				</Badge>
				</>
			),
		},
		{
			key: "6",
			icon: <ShoppingOutlined />,
			label: (
				<>
			<Link to="/preorders">PreOrders</Link>
				<Badge count={ptypeOrdersCount} style={{ backgroundColor: "black", color: "white" }} offset={[-2,0]} >
				</Badge>
				</>

			)
			
		},
		{
			key: "7",
			icon: <UndoOutlined />,
			label: <Link to="/adminreturns">Returnes</Link>,
		},
		{
			key: "8",
			icon: <DollarCircleOutlined />,
			label: <Link to="/discounts">Discounts</Link>,
		},
		{
			key: "9",
			icon: <DollarCircleOutlined />,
			label: <Link to="/adminreviews">Reviews</Link>,
		},
		{
			key: "10",
			icon: <DollarCircleOutlined />,
			label: <Link to="/newsletter">Newsletter</Link>,
		},
		{
			key: "11",
			icon: <NotificationOutlined />,
			label: <Link to="/notifications">Notifications</Link>,
		},
	];

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
				}}>
				<Menu
					mode="inline"
					theme="light"
					defaultSelectedKeys={defaultSelectedKeys()}
					className="menu"
					items={menuItems}
				/>
			</Sider>
			<Layout>
				<Header className="head">
					<div className="header-logo">
						<a href="/">
							<img alt="logo" src={logo} />
						</a>
					</div>
					{/* <Button
						type="primary"
						icon={<LogoutOutlined />}
						onClick={handleLogoutClick}
						className="sidebar-logout-btn">
						Logout
					</Button> */}
				</Header>

				<div className="content">{children}</div>
			</Layout>
		</Layout>
	);
};

export default Main;
