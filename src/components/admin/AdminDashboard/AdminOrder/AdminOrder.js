import React, { useState, useEffect } from "react";
import { fetchOrderById } from "../../../../store/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Card from "antd/es/card/Card";
import "./AdminOrder.css";
import { Col, Row, Table, Select, Button, Modal, message } from "antd";
import { updateOrderStatus } from "../../../../store/orderSlice";
import Main from "../../AdminLayout/AdminLayout";
import Loader from "../../../Loader/Loader";

const { Option } = Select;

const AdminOrder = () => {
  const { id } = useParams();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { SingleOrder, SingleOrderloading } = useSelector(
    (state) => state.orders
  );
  const [shipNowLoading, setShipNowLoading] = useState(false);

  const dispatch = useDispatch();

  const [orderStatus, setOrderStatus] = useState(SingleOrder?.status);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const orderId = id;
    dispatch(fetchOrderById({ apiurl, access_token, orderId }));
  }, [dispatch, apiurl, id, SingleOrder.is_shipped]);

  const handleStatusChange = (value) => {
    setOrderStatus(value);
  };

  const handleChangeClick = () => {
    const UpdatedStatus = orderStatus;
    dispatch(
      updateOrderStatus({
        apiurl,
        access_token,
        UpdatedStatus,
        orderId: SingleOrder.id,
      })
    )
      .unwrap()
      .then(() => {
        const orderId = id;
        dispatch(fetchOrderById({ apiurl, access_token, orderId }));
        setIsModalVisible(false); // Close modal after update
      });
  };

  const dataSource = SingleOrder.items
    ? SingleOrder.items.map((item) => ({
        key: item.id,
        product: item.product_name,
        color: item.product_color,
        quantity: item.quantity,
        price: item.price,
        item: item.item,
        TotalItem: item,
      }))
    : [];

  const totalRow = {
    key: "total",
    product: "Total Order Amount",
    quantity: "",
    price: SingleOrder?.total_discount_price || 0,
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 250,
      render: (product, record, TotalItem) => {
        console.log(record?.item?.size);

        const firstImage =
          record?.item?.images?.length > 0
            ? record?.item?.images[0]?.image
            : "";
        console.log(
          "record?.TotalItem?.product_image",
          record?.TotalItem?.product_image
        );

        // Use product_image if available, otherwise fallback to firstImage
        const finalImage = record?.TotalItem?.product_image
          ? record?.TotalItem?.product_image
          : firstImage;

        return (
          <Row
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Col>
              {finalImage ? (
                <img
                  src={`${apiurl}${finalImage}`}
                  alt={product || "Product Image"}
                  className="admin-order-table wishlist_images"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              ) : (
                ""
              )}
            </Col>
            <Col style={{ flex: 1 }}>
              <p style={{ fontWeight: "bold", margin: 0 }}>
                {product || "Unknown Product"}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Color:</strong> {record.color || "Unknown Color"}
              </p>

              {record?.item?.size && (
                <p style={{ margin: 0 }}>
                  <strong>Size:</strong> {record?.item?.size}
                </p>
              )}
            </Col>
          </Row>
        );
      },
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => {
        console.log("record", record);
        return record.key === "total" ? null : <p>{quantity}</p>;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        return <p>{price}</p>;
      },
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleShipNow = () => {
    setShipNowLoading(true);
    fetch(`${apiurl}/orders/prebook/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        message.success("successfully shipped");
        const orderId = id;
        dispatch(fetchOrderById({ apiurl, access_token, orderId }));

        // console.log("Response:", data);
      })
      .catch((error) => {
        message.error("something got error");
        // console.log("Error:", error);
      })
      .finally(() => {
        setShipNowLoading(false); // Stop loading
      });
  };
  // console.log(shipNowLoading);

  if (SingleOrderloading) {
    return (
      <Main>
        <Loader />
      </Main>
    );
  }

  if (SingleOrderloading) {
    return (
      <Main>
        <Loader />
      </Main>
    );
  }

  return (
    <Main>
      <div className="admin-order-container">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            marginRight: "20px",
          }}
        >
          {SingleOrder?.items?.[0]?.p_type ? (
            !SingleOrder?.is_shipped ? (
              <button
                className="ship-now-button"
                onClick={() => {
                  handleShipNow();
                }}
              >
                Ship Now
              </button>
            ) : (
              <div
                style={{
                  fontWeight: "600",
                  color: "#f24c88",
                  marginBottom: "10px",
                  padding: "5px",
                  borderBottom: "2px solid",
                }}
              >
                This Order is Shipped
              </div>
            )
          ) : (
            ""
          )}
        </div>
        <Modal
          title="Update Order Status"
          open={isModalVisible}
          onOk={handleChangeClick}
          onCancel={handleCancel}
          okText="Update"
          cancelText="Cancel"
        >
          <Select
            value={orderStatus}
            onChange={handleStatusChange}
            style={{ width: "100%" }}
          >
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="returned">Returned</Option>
            <Option value="pending">Pending</Option>
          </Select>
        </Modal>

        <div className="admin-order-cards">
          <Card
            title={`Order Id : #${SingleOrder?.id}`}
            className="admin-order-card"
          >
            <p>
              <strong>Method:</strong> {SingleOrder?.payment_method}
            </p>
            <p>
              <strong>Status:</strong> {SingleOrder?.payment_status}
            </p>
            <p>
              <strong>Current Status:</strong> {SingleOrder?.status}{" "}
              <Button type="text" danger onClick={showModal}>
                Update
              </Button>
            </p>
          </Card>

          <Card title="Customer Details" className="admin-order-card">
            <p>
              <strong>Username:</strong> {SingleOrder?.user?.username}
            </p>
            <p>
              <strong>Email:</strong> {SingleOrder?.user?.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {SingleOrder?.user?.phone_number}
            </p>
          </Card>

          <Card title="Shipping" className="admin-order-card">
            <p>
              <strong>Address:</strong> {SingleOrder?.shipping_address?.address}
            </p>
            <p>
              <strong>City:</strong> {SingleOrder?.shipping_address?.city}
            </p>
            <p>
              <strong>Pincode:</strong> {SingleOrder?.shipping_address?.pincode}
            </p>
            <p>
              <strong>State:</strong> {SingleOrder?.shipping_address?.state}
            </p>
          </Card>
        </div>

        <Table
          className="admin-order-table"
          style={{ marginTop: "50px" }}
          dataSource={[...dataSource]}
          columns={columns}
          rowKey="id"
          pagination={false}
        />

        <div style={{ margin: "24px auto", maxWidth: "340px" }}>
          {SingleOrder?.reward_eligible && (
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                boxShadow: "0px 2px 12px rgba(0,0,0,0.08)",
                background: "#fafafa",
              }}
            >
              {/* Reward Image */}
              <img
                src="https://pngimg.com/uploads/coin/coin_PNG36871.png"
                alt="Reward"
                style={{
                  width: "55px",
                  height: "55px",
                  objectFit: "contain",
                  flexShrink: 0,
                }}
              />

              {/* Reward Info */}
              <div>
                <h4
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "17px",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {SingleOrder?.reward_count} ×{" "}
                  {SingleOrder?.reward_description}
                </h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                  🎉 Congratulations! You’ve earned this reward
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          className="specific-order-total"
          style={{ marginTop: "20px", width: "100vw" }}
        >
          <p>
            <span className="label">Actual Amount:</span>
            <span className="value">
              ₹{SingleOrder?.total_order_price || 0}
            </span>
          </p>
          {SingleOrder?.total_order_price >
            SingleOrder?.total_discount_price && (
            <p>
              <span className="label">Discount Amount:</span>
              <span className="value">
                - ₹
                {SingleOrder?.total_order_price -
                  SingleOrder?.total_discount_price}
              </span>
            </p>
          )}
          <p>
            <span className="label">Delivery Charge:</span>
            <span className="value">+₹{SingleOrder?.shipping_charges}</span>
          </p>
          <p>
            <span className="label">Total Paid:</span>
            <span className="value">
              ₹
              {Number(SingleOrder?.total_discount_price) +
                Number(SingleOrder?.shipping_charges)}
            </span>
          </p>
        </div>
      </div>
    </Main>
  );
};

export default AdminOrder;
