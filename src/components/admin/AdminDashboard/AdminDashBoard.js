import React,{useState} from "react";
import { Layout,  Row, Col,Space,Table, Checkbox,  Button } from "antd";
import {
  EllipsisOutlined
} from "@ant-design/icons";
import AdminNav from "./AdminNav/AdminNav";
import AdminHeader from "../AdminHeader/AdminHeader";
import DashboardCard from "./DashboardCard/DashboardCard";
import "./AdminDashboard.css"; // Custom CSS file for styling
import { Outlet } from "react-router-dom";
import FirstIcon from "./images/FirstCardIcon.svg";
import SecondIcon from "./images/SecondCardIcon.svg";
import ThirdIcon from "./images/ThirdCardIcon.svg";
import FourtIcon from "./images/FourtCardIcon.svg";

import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const { Content } = Layout;

const AdminDashBoard = () => {
  const options = {
    animationEnabled: true,
    title: {
      text: "Monthly Sales - 2024",
    },
    axisX: {
      valueFormatString: "MMM",
    },
    axisY: {
      title: "Sales (in INR)", // Change title to INR
      prefix: "₹", // Use the Indian Rupee symbol
    },
    data: [
      {
        type: "spline", // Type of chart
        markerType: "none", // Removes the dots
        lineColor: "#ff0044", // Sets the line color to pink
        lineThickness: 4, // Increases the line width
        yValueFormatString: "₹#,###", // Format for the y-axis value
        xValueFormatString: "MMMM",
        dataPoints: [
          { x: new Date(2024, 0), y: 25060 },
          { x: new Date(2024, 1), y: 27980 },
          { x: new Date(2024, 2), y: 42800 },
          { x: new Date(2024, 3), y: 32400 },
          { x: new Date(2024, 4), y: 35260 },
          { x: new Date(2024, 5), y: 33900 },
          { x: new Date(2024, 6), y: 40000 },
          { x: new Date(2024, 7), y: 52500 },
          { x: new Date(2024, 8), y: 32300 },
          { x: new Date(2024, 9), y: 42000 },
          { x: new Date(2024, 10), y: 37160 },
          { x: new Date(2024, 11), y: 38400 },
        ],
      },
    ],
  };
  // Data for the dashboard cards
  const cardsData = [
    { title: "950", subtitle: "Dashboard Title", Icon: FirstIcon },
    { title: "120", subtitle: "Products", Icon: SecondIcon },
    { title: "30", subtitle: "Fabrics", Icon: ThirdIcon },
    { title: "45", subtitle: "Users", Icon: FourtIcon },
  ];



  const data = [
    {
      key: "1",
      product: "Laptop",
      orderID: "ORD1234",
      date: "2024-11-20",
      customerName: "John Doe",
      status: "Shipped",
      amount: "$1200",
      imageUrl: "https://via.placeholder.com/40",
    },
    {
      key: "2",
      product: "Mobile",
      orderID: "ORD5678",
      date: "2024-11-21",
      customerName: "Jane Smith",
      status: "Pending",
      amount: "$800",
      imageUrl: "https://via.placeholder.com/40",
    },
    // Add more sample data as needed
    {
      key: "1",
      product: "Laptop",
      orderID: "ORD1234",
      date: "2024-11-20",
      customerName: "John Doe",
      status: "Shipped",
      amount: "$1200",
      imageUrl: "https://via.placeholder.com/40",
    },
    {
      key: "2",
      product: "Mobile",
      orderID: "ORD5678",
      date: "2024-11-21",
      customerName: "Jane Smith",
      status: "Pending",
      amount: "$800",
      imageUrl: "https://via.placeholder.com/40",
    },
    {
      key: "1",
      product: "Laptop",
      orderID: "ORD1234",
      date: "2024-11-20",
      customerName: "John Doe",
      status: "Shipped",
      amount: "$1200",
      imageUrl: "https://via.placeholder.com/40",
    },
    {
      key: "2",
      product: "Mobile",
      orderID: "ORD5678",
      date: "2024-11-21",
      customerName: "Jane Smith",
      status: "Pending",
      amount: "$800",
      imageUrl: "https://via.placeholder.com/40",
    },
  ];
  
  const columns = [
    {
      title: <span>Product</span>,
      dataIndex: "product",
      key: "product",
    },
    {
      title: <span>OrderID</span>,
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: <span>Date</span>,
      dataIndex: "date",
      key: "date",
    },
    {
      title: <span>Customer Name</span>,
      dataIndex: "customerName",
      key: "customerName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.imageUrl}
            alt="Customer"
            style={{ borderRadius: "5px", width: "40px", height: "40px", marginRight: "10px" }}
          />
          {text}
        </div>
      ),
    },
    {
      title: <span>Status</span>,
      dataIndex: "status",
      key: "status",
    },
    {
      title: <span>Amount</span>,
      dataIndex: "amount",
      key: "amount",
    },
  ];



  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectChange,
  };

  
  return (
    // <Layout style={{ minHeight: "100vh" }}>
    //   {/* Sidebar */}
    //   <AdminNav />
    //   {/* Main Section */}
    //   <Layout>
    //     {/* Header */}
    //     <AdminHeader />
    //     {/* Content */}

    //   </Layout>
    // </Layout>
    <>
      <Content className="custom-content">
        <Outlet />
        <div className="cards_Container">
          {cardsData.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              subtitle={card.subtitle}
              Icon={card.Icon}
            />
          ))}
        </div>
      </Content>

      <div className="graph_bestseller">
        <div style={{ height: "200px", width: "600px" }}>
          <CanvasJSChart options={options} />
        </div>

        <div className="bestSeller">
          <div className="heading">
            <h2>Best Seller</h2>
            <h2>icon</h2>
          </div>
          <div className="cards_container">
            <div className="bestseller_cards" style={{ padding: "20px" }}>
              <Row gutter={16} align="middle" style={{height:"70px",marginTop:"10px"}}>
                {/* First Column: Card */}
                <Col span={8}>
                 <img src="./dummyimage.jpg" style={{width:'55px',borderRadius:"8px"}}></img>
                </Col>
                {/* Second Column: h2 and h3 */}
                <Col span={8}style={{height:"100%"}}>
                    <h3 style={{ margin: "0", fontWeight: "bold" }}>
                      Heading 
                    </h3>
                    <h4 style={{ margin: "5px 0", color: "#888" }}>
                    ₹126.50
                    </h4>
                </Col>

                {/* Third Column: h1 and h3 */}
                <Col span={8} >
                    <h2 style={{ margin: "0", fontWeight: "bold" }}>
                    ₹126.50
                    </h2>
                    <h3 style={{ margin: "5px 0", color: "#888" }}>
                      Subhead
                    </h3>
                </Col>
              </Row>
              <Row gutter={16} align="middle" style={{height:"70px",marginTop:"10px"}}>
                {/* First Column: Card */}
                <Col span={8}>
                 <img src="./dummyimage.jpg" style={{width:'55px',borderRadius:"8px"}}></img>
                </Col>
                {/* Second Column: h2 and h3 */}
                <Col span={8}style={{height:"100%"}}>
                    <h3 style={{ margin: "0", fontWeight: "bold" }}>
                      Heading 
                    </h3>
                    <h4 style={{ margin: "5px 0", color: "#888" }}>
                    ₹126.50
                    </h4>
                </Col>

                {/* Third Column: h1 and h3 */}
                <Col span={8} >
                    <h2 style={{ margin: "0", fontWeight: "bold" }}>
                    ₹126.50
                    </h2>
                    <h3 style={{ margin: "5px 0", color: "#888" }}>
                      Subhead
                    </h3>
                </Col>
              </Row>
              <Row gutter={16} align="middle" style={{height:"70px",marginTop:"10px"}}>
                {/* First Column: Card */}
                <Col span={8}>
                 <img src="./dummyimage.jpg" style={{width:'55px',borderRadius:"8px"}}></img>
                </Col>
                {/* Second Column: h2 and h3 */}
                <Col span={8}style={{height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center"}}>
                    <h3 style={{ margin: "0", fontWeight: "bold" }}>
                      Heading 
                    </h3>
                    <h4 style={{ margin: "5px 0", color: "#888" }}>
                    ₹126.50
                    </h4>
                </Col>

                {/* Third Column: h1 and h3 */}
                <Col span={8} >
                    <h2 style={{ margin: "0", fontWeight: "bold" }}>
                    ₹126.50
                    </h2>
                    <h3 style={{ margin: "5px 0", color: "#888" }}>
                      Subhead
                    </h3>
                </Col>
              </Row>
            </div>
            {/* <div className="bestseller_card">div cards </div>
            <div className="bestseller_card">div cards </div>
            <div className="bestseller_card">div cards </div> */}
          </div>
        </div>
      </div>

      {/* orders table  */}

      <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <h2>Recent Orders</h2>
        <Button
          icon={<EllipsisOutlined />}
          style={{ border: "none", background: "none" }}
        />
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        rowClassName="editable-row"
      />
    </div>
    </>
  );
};

export default AdminDashBoard;
