import React from "react";
import { Layout } from "antd";
import AdminNav from "../AdminDashboard/AdminNav/AdminNav";
import AdminHeader from "../AdminHeader/AdminHeader";
import DashboardCard from "../AdminDashboard/DashboardCard/DashboardCard";
import FirstIcon from "./images/FirstCardIcon.svg";
import SecondIcon from "./images/SecondCardIcon.svg";
import ThirdIcon from "./images/ThirdCardIcon.svg";
import FourtIcon from "./images/FourtCardIcon.svg";
import './AdminLayout.css'
import { Outlet } from "react-router-dom";
const { Content } = Layout;

const AdminLayout = () => {
  const cardsData = [
    { title: "950", subtitle: "Dashboard Title", Icon: FirstIcon },
    { title: "120", subtitle: "Products", Icon: SecondIcon },
    { title: "30", subtitle: "Fabrics", Icon: ThirdIcon },
    { title: "45", subtitle: "Users", Icon: FourtIcon },
  ];
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <AdminNav />
      {/* Main Section */}
      <Layout>
        {/* Header */}
        <AdminHeader />
        {/* Content */}
        <Content className="custom-content">
          <Outlet />
         
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
