import React, { useState, useEffect } from "react";
import { fetchOrderById, removeOrderItem } from "../../../store/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Card from "antd/es/card/Card";
// import "./AdminOrder.css";
import { Col, Row, Table, Select, Button, Popconfirm } from "antd";
import Heading from "../Heading/Heading";
import { updateOrderStatus } from "../../../store/orderSlice";
import { removeOrder } from "../../../store/orderSlice";
import Banner from "./images/productpageBanner.png";
import "./Orderpage.css";
import { returnOrder } from "../../../store/orderSlice";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const { Option } = Select;

const Orderpage = () => {
  const { id } = useParams();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { SingleOrder } = useSelector((state) => state.orders);
  console.log("intiatil statu", SingleOrder?.status);

  const dispatch = useDispatch();

  const [orderStatus, setOrderStatus] = useState(SingleOrder?.status);
  const [date, setDate] = useState(null);
  const [textarea, settextarea] = useState("");

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
      console.log("Date:", date); // Example: "2024-12-05"
      console.log("Time:", time); // Example: "15:02"
    }
  }, [date]);

  const handleStatusChange = (value) => {
    setOrderStatus(value);
  };

  const handleChangeClick = () => {
    console.log(orderStatus);
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
    settextarea(e.target.value);
  };

  const handleReturnOrder = () => {
    const orderId = id;
    console.log(textarea);
    const reson = textarea;
    dispatch(returnOrder({ apiurl, access_token, orderId, reson }))
      .unwrap()
      .then(() => {
        const orderId = id;
        dispatch(fetchOrderById({ apiurl, access_token, orderId }));
      });
  };

  const handleCancelEachItem=(itemid)=>{
    console.log("delete this ordferitem id ",itemid)

    dispatch(removeOrderItem({apiurl,access_token,itemid}))
  }

  console.log("SingleOrderitems", SingleOrder);
  const dataSource = SingleOrder.items
    ? SingleOrder.items.map((item) => ({
        key: item.id,
        product: item.item,
        id:item.id,
        quantity: item.quantity,
        price: item.total_price,
      }))
    : [];

  const totalRow = {
    key: "total",
    product: "Total Order Amount",
    quantity: "",
    price: SingleOrder.total_order_price || 0,
    action:"",
  };

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
          <Row
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
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
        // Check if the row is the total row
        if (record.key === "total") {
          return null; // No cancel button for the total row
        }
  
        return (
          <Button
            type="primary"
            danger
            onClick={() => handleCancelEachItem(id)} // Call the cancel function
          >
            Cancel
          </Button>
        );
      },
    },
  ];
  
  return (
    <>
      <div className="user_orderpage">
        <img className="order_banner_image" src={Banner} />
       <div className="product_heading"><Heading>Order Page</Heading></div> 
        <div className="order_data_div">
          <Breadcrumb>
            {/* Home Link */}
            <Breadcrumb.Item>
              <Link to={"/"}>Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={"/profile"}>Orders</Link>
            </Breadcrumb.Item>

            {/* Current Page */}
            <Breadcrumb.Item>Order Details</Breadcrumb.Item>
          </Breadcrumb>

          <h4 style={{ marginBottom: "5px", marginTop: "20px" }}>
            Order id : {SingleOrder?.id}
          </h4>
          <h4 style={{ marginBottom: "20px" }}>
            Status : {SingleOrder?.status}
          </h4>
          {/* <h2 style={{}}>Order Date :{date}</h2> */}

          <Table
            className="custom-table"
            dataSource={[...dataSource, totalRow]}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
          <div className="return_and_cancel_address">
            <div className="return_cancel">
              <textarea
                placeholder="Enter your Reson here..."
                rows="11"
                // name={textarea}
                value={textarea}
                cols="50"
                onChange={handletextchange}
                style={{
                  width: "100%",
                  resize: "vertical",
                  borderRadius: "8px",
                  textIndent: "20px",
                }}
              />
              <Popconfirm
                title="Are you sure you want to Return the entire order?"
                onConfirm={handleReturnOrder} // Action to perform on confirmation
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  size="middle"
                  style={{
                    width: "16vw",
                    margin: "0 auto",
                    backgroundColor: "yellowgreen",
                  }}
                >
                  Return Order
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Are you sure you want to cancel the entire order?"
                onConfirm={handleCancelOrder} // Action to perform on confirmation
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
                <strong>Address:</strong>{" "}
                {SingleOrder?.shipping_address?.address}
              </p>
              <p>
                <strong>City:</strong> {SingleOrder?.shipping_address?.city}
              </p>
              <p>
                <strong>Pincode:</strong>{" "}
                {SingleOrder?.shipping_address?.pincode}
              </p>
              <p>
                <strong>State:</strong> {SingleOrder?.shipping_address?.state}
              </p>
            </div>
          </div>

          <div className="AdminOrder">
            {/* Pick From  */}

            {/* Payment Info  for admin*/}
            {/* <div className="custom-card">
              <h3 className="card-title">Payment Info</h3>
              <p>
                <strong>Method:</strong> {SingleOrder?.payment_method}
              </p>
              <p>
                <strong>Status:</strong> {SingleOrder?.payment_status}
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Orderpage;
