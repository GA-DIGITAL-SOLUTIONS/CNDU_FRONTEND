import React from 'react'
import './AdminNav.css'

import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  DeploymentUnitOutlined,
  ShoppingOutlined,
  UndoOutlined,
  UserOutlined,
} from "@ant-design/icons";

import adminnavlogo from './assets/adminnavlogo.svg'
import AdminHeader from '../../AdminHeader/AdminHeader';

const { Sider } = Layout;

const AdminNav = () => {
  return (
    <>
      <Sider
        className="admin-sider" // Apply the custom class
        width="20%" // Parent has 35% width
      >
        {/* Logo Section */}
     
                  <img src={adminnavlogo} alt="Logo" className="logo-image" />
        {/* Menu Items */}
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="admin-menu" // Apply the custom class
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<ShoppingCartOutlined />}>
            Products
          </Menu.Item>
          <Menu.Item key="3" icon={<AppstoreOutlined />}>
            Fabrics
          </Menu.Item>
          <Menu.Item key="4" icon={<DeploymentUnitOutlined />}>
            Combination
          </Menu.Item>
          <Menu.Item key="5" icon={<ShoppingOutlined />}>
            Orders
          </Menu.Item>
          <Menu.Item key="6" icon={<UndoOutlined />}>
            Returned
          </Menu.Item>
          <Menu.Item key="7" icon={<UserOutlined />}>
            Profile
          </Menu.Item>
        </Menu>
      </Sider>
   </>
  )
}

export default AdminNav