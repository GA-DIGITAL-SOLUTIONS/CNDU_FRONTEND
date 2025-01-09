import React, { useEffect, useState } from "react";
import { List, Button, Typography, Row, Col, message } from "antd";
import {
  ExclamationCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "./Notifications.css";
import { useSelector } from "react-redux";
import Main from "../AdminLayout/AdminLayout";

const { Text } = Typography;

const NotificationItem = ({ item }) => {
  const icon =
    item.type !== "alert" ? (
      <ExclamationCircleOutlined style={{ color: "#FF4D4F" }} />
    ) : (
      <EnvironmentOutlined style={{ color: "#ff7875" }} />
    );

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <List.Item className={`notification-item`}>
      <List.Item.Meta
        avatar={<div className="notification-icon">{icon}</div>}
        title={<Text>{item.title}</Text>}
        description={item.message}
      />
      <div className="notification-time">{formatDate(item.created_at)}</div>
    </List.Item>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { apiurl, access_token } = useSelector((state)=>state.auth)
  

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${apiurl}/notifications/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      message.error("Error fetching notifications");
    }
  };

  return (
    <Main>
      <div className="notifications-container">
        <Row justify="space-between" align="middle">
          <Col>
            <h2 className="notifications-title">Notifications</h2>
          </Col>
        </Row>

        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => <NotificationItem item={item} />}
        />
      </div>
    </Main>
  );
};

export default Notifications;
