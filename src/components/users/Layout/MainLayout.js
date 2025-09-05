import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

import Body from "../Body/Body";
import PromoBanner from "../PromoBanner";
const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <PromoBanner />
      <Header />
      <Outlet/>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
