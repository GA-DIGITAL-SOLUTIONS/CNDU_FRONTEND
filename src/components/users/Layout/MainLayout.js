import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "antd/es/layout";
import Footer from "../Footer/Footer";
import PromoBanner from "../PromoBanner";
const Header = React.lazy(() => import("../Header/Header"));

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "white" }}>
      {/* <PromoBanner /> */}
      <React.Suspense fallback={<div style={{ height: "75px", background: "#fff" }} />}>
        <Header />
      </React.Suspense>
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
