import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "antd/es/layout";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import PromoBanner from "../PromoBanner";

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <PromoBanner />
      <Header />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
