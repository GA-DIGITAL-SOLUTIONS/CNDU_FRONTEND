import React from "react";
import { useSelector } from "react-redux";
import { Card, Button } from "antd";

const { Meta } = Card;

const WishListItem = ({ item, onRemove }) => {
  const { apiurl } = useSelector((store) => store.auth);

  return (
    <Card
      hoverable
      style={{ width: 240, margin: "10px" }}
      cover={
        <img
          alt={item.name}
          src={`${apiurl}${item.image}`}
          style={{ height: "200px", objectFit: "cover" }}
        />
      }
      actions={[
        <Button type="danger" onClick={() => onRemove(item.id)}>
          Remove
        </Button>
      ]}
    >
      <Meta title={item.name} description={`Price: Rs ${item.price || "N/A"}`} />
    </Card>
  );
};

export default WishListItem;
