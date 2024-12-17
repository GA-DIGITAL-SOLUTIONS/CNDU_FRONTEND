import React, { useState } from "react";
import { Tabs, Button, Form, Input, message } from "antd";
import AccountTab from "./AccountTab";
import "./style.css";
import Address from "./Address";
import LogoutTab from "./Logout";
import PasswordTab from "./PasswordTab";
import OrdersTab from "./OrdersTab";
import WishlistTab from "./WishlistTab";
import NotificationsTab from "./NotificationsTab";
import { changePassword } from "../../../store/password/passwordSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Returns from "./Returns";

const { TabPane } = Tabs;

const UserAccount = () => {
  return (
    <div className="user-account">
      <img
        alt="productbanner"
        src="./productpageBanner.png"
        className="banner"
      />
      <div className="tabs-container">
        <Tabs defaultActiveKey="1" tabPosition="left" className="custom-tabs">
          <TabPane tab="Account" key="1">
            <AccountTab />
          </TabPane>
          <TabPane tab="Password" key="2">
            <PasswordTab />
          </TabPane>
          <TabPane tab="Address" key="3">
            <Address />
          </TabPane>
          <TabPane tab="Orders" key="4">
            <OrdersTab />
          </TabPane>
          <TabPane tab="Returns" key="5">
            <Returns />
          </TabPane>
          <TabPane tab="Wishlist" key="6">
            <WishlistTab />
          </TabPane>
          <TabPane tab="Log Out" key="7">
            <LogoutTab />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default UserAccount;
