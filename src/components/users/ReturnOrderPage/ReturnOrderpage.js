import React, { useState, useEffect } from "react";
import { fetchOrderById, removeOrderItem } from "../../../store/orderSlice";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Card from "antd/es/card/Card";
import { Col, Row, Table, Select, Button,Checkbox, Modal, message ,Popconfirm} from "antd";
import Heading from "../Heading/Heading";
import { updateOrderStatus } from "../../../store/orderSlice";
import { removeOrder } from "../../../store/orderSlice";
import Banner from "./images/productpageBanner.png";
import { returnOrder } from "../../../store/orderSlice";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const { Option } = Select;

const ReturnOrderpage = () => {
  const { id } = useParams();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { SingleOrder } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
	const [returnarray, setReturnArray] = useState([]);
  const [orderStatus, setOrderStatus] = useState(SingleOrder?.status);
  const [date, setDate] = useState(null);
  const [textarea, setTextarea] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const orderId = id;
    dispatch(fetchOrderById({ apiurl, access_token, orderId }));
  }, [dispatch, apiurl, id]);

  useEffect(() => {
    const createdAt = SingleOrder?.created_at;

    if (createdAt) {
      const dateObj = new Date(createdAt);
      const date = dateObj.toISOString().split("T")[0];
      const time = dateObj.toTimeString().split(" ")[0].slice(0, 5);
      setDate(date);
    }
  }, [date]);

  const handleStatusChange = (value) => {
    setOrderStatus(value);
  };


	  // Handle checkbox change: add or remove item from returnarray
		const handleCheckboxChange = (e, id) => {
			if (e.target.checked) {
				setReturnArray((prev) => [...prev, id]);
			} else {
				setReturnArray((prev) => prev.filter((itemId) => itemId !== id));
			}
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
      });
  };

  const handleCancelOrder = () => {
    dispatch(removeOrder({ apiurl, access_token, orderId: id }))
      .unwrap()
      .then(() => {
        const orderId = id;
        dispatch(fetchOrderById({ apiurl, access_token, orderId }));
      });
  };

  const handletextchange = (e) => {
    setTextarea(e.target.value);
  };

  const handleReturnOrder = () => {
		console.log("working ",textarea)

		if (returnarray.length > 0) {
			if(!textarea==""){
				const	array=JSON.stringify(returnarray)
			dispatch(returnOrder({ apiurl, access_token, array,textarea }))
      .unwrap()
      .then(() => {
        const orderId = id;
        dispatch(fetchOrderById({ apiurl, access_token, orderId }));
        setIsModalVisible(false); // Close the modal after submission

      }
			
		);

			}else{
				message.error("please mension return reson ")
			}


    
    } else {
      message.error("Please select at least one item to return.");
    }

  };

  const handleCancelEachItem = (itemid) => {
    dispatch(removeOrderItem({ apiurl, access_token, itemid }));
  };

  const dataSource = SingleOrder.items
    ? SingleOrder.items.map((item) => ({
        key: item.id,
        product: item.item,
        id: item.id,
        quantity: item.quantity,
        price: item.total_price,
      }))
    : [];

		const dataSource2 = SingleOrder.items
    ? SingleOrder.items.map((item) => ({
        key: item.id,
        product: item.item,
        id: item.id,
        quantity: item.quantity,
        price: item.total_price,
      }))
    : [];

  const totalRow = {
    key: "total",
    product: "Total Order Amount",
    quantity: "",
    price: SingleOrder.total_order_price || 0,
    action: "",
  };


	const columns2=[
		{
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 250,
      render: (product, record) => {
        if (record.key === "total") {
          return <strong>{product}</strong>;
        }
        const firstImage =
          product.images?.[0]?.image || "https://via.placeholder.com/80";
        return (
          <Row style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Col>
              <img
                src={`${apiurl}${firstImage}`}
                alt={product.product}
                className="wishlist_images"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </Col>
            <Col style={{ flex: 1 }}>
              <p style={{ fontWeight: "bold", margin: 0 }}>{product.product}</p>
              <p style={{ fontWeight: "bold", margin: 0 }}>
                color: {product.color?.name}
              </p>
            </Col>
          </Row>
        );
      },
    },
		{
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => {
        return (
          <Checkbox
            onChange={(e) => handleCheckboxChange(e, id)}
            checked={returnarray.includes(id)} // Ensure checkbox reflects the state
          />
        );
      },
    },
	]

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 250,
      render: (product, record) => {
        if (record.key === "total") {
          return <strong>{product}</strong>;
        }
        const firstImage =
          product.images?.[0]?.image || "https://via.placeholder.com/80";
        return (
          <Row style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Col>
              <img
                src={`${apiurl}${firstImage}`}
                alt={product.product}
                className="wishlist_images"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </Col>
            <Col style={{ flex: 1 }}>
              <p style={{ fontWeight: "bold", margin: 0 }}>{product.product}</p>
              <p style={{ fontWeight: "bold", margin: 0 }}>
                color: {product.color?.name}
              </p>
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
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        if (record.key === "total") {
          return null;
        }
        return (
          <Button type="primary" danger onClick={() => handleCancelEachItem(id)}>
            Cancel
          </Button>
        );
      },
    },
  ];

	const handleSubmit = () => {
    
  };


  return (
    <>
      <div className="user_orderpage">
        <img className="order_banner_image" src={Banner} />
        <div className="product_heading">
          <Heading>Order Page</Heading>
        </div>
        <div className="order_data_div">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={"/"}>Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={"/profile"}>Orders</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Order Details</Breadcrumb.Item>
          </Breadcrumb>

          <h4 style={{ marginBottom: "5px", marginTop: "20px" }}>
            Order id : {SingleOrder?.id}
          </h4>
          <h4 style={{ marginBottom: "20px" }}>Status : {SingleOrder?.status}</h4>

          <Table
            className="custom-table"
            dataSource={[...dataSource, totalRow]}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
          <div className="return_and_cancel_address">
            <div className="return_cancel">
              <Button
                type="primary"
                size="middle"
                onClick={() => setIsModalVisible(true)} // Open the modal
                style={{
                  width: "16vw",
                  margin: "0 auto",
                  backgroundColor: "yellowgreen",
                }}
              >
                Return Order
              </Button>

              <Popconfirm
                title="Are you sure you want to cancel the entire order?"
                onConfirm={handleCancelOrder}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  danger
                  size="middle"
                  style={{ width: "16vw", margin: "0 auto" }}
                >
                  Cancel Order
                </Button>
              </Popconfirm>
            </div>

            <div className="order_custom_card">
              <h3 className="card-title">Pick From</h3>
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
            </div>
          </div>
        </div>
      </div>

      {/* Modal for returning the order */}
      <Modal
        title="Return Order"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null} // Hide default footer buttons
      >
        <div>
				<Table
            className="custom-table"
            dataSource={dataSource2}
            columns={columns2}
            rowKey="id"
            pagination={false}
          />
          <textarea
            placeholder="Enter your reason here..."
            rows="6"
            value={textarea}
            onChange={handletextchange}
            style={{
              width: "100%",
              resize: "vertical",
              borderRadius: "8px",
              textIndent: "20px",
            }}
          />
          <Button
            type="primary"
            size="middle"
            onClick={handleReturnOrder}
            loading={isSubmitting}
            style={{
              marginTop: "10px",
              backgroundColor: "yellowgreen",
            }}
          >
            Submit Request
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ReturnOrderpage;
