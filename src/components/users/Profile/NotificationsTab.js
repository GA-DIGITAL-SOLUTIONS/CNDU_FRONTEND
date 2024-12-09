import React from 'react';
import { List, Card, Avatar, Typography } from 'antd';
import { BellFilled } from '@ant-design/icons';

const NotificationsTab = () => {
  // Sample notifications array
  const notifications = [
    "New user signed up",
    "Order #1234 has been shipped",
    "Your password was updated successfully",
    "New comment on your post",
    "System maintenance scheduled for 12/10",
  ];

  return (
    <div className='notification_container'>

    <Card 
      title={<Typography.Title level={4}>Notifications</Typography.Title>} 
      style={{ width: 500, margin: "20px auto", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
    >
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<BellFilled style={{ color: '#f24c88', fontSize: '18px' }} />} />}
              title={<Typography.Text strong>{item}</Typography.Text>}
            />
          </List.Item>
        )}
      />
    </Card>
    </div>

  );
};

export default NotificationsTab;
