import React from "react";
import { Input } from "antd";  // Importing Ant Design Input
import { SearchOutlined } from "@ant-design/icons"; // Using Ant Design search icon
import './AdminHeader.css'; // Import custom styling for AdminHeader
import adminNotificactionicon from './adminNotificationLogo.svg'
import searchIcon from './adminHeaderSearchIcon.svg'

const { Search } = Input; // Using Ant Design's Search component

const AdminHeader = () => {
  return (
    <div className="admin_header">
      {/* Input and search icon container */}
      <div className="search-container">
        <div className="image_container">
        <img  src={searchIcon}/>
        </div>
        <input placeholder="Search" className="input"/>
      </div>
      {/* Notification logo */}
      <img
        src={adminNotificactionicon}
        alt="Notification"
        className="notification_logo"
      />
    </div>
  );
};

export default AdminHeader;
