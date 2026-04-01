import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "antd/es/layout";
import Header from "../Header/Header";
const Footer = React.lazy(() => import("../Footer/Footer"));

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "white" }}>
      {/* <PromoBanner /> */}
      <Header />
      <Content>
        <Outlet />
      </Content>
      <React.Suspense fallback={<div style={{ height: "200px" }} />}>
        <Footer />
      </React.Suspense>
    </Layout>
  );
};

export default MainLayout;
