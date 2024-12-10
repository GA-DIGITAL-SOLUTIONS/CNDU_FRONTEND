import React, { useState, useEffect } from "react";
import { fetchOrderById, removeOrderItem } from "../../../store/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UploadOutlined } from '@ant-design/icons';

import Card from "antd/es/card/Card";
import {
  Col,
  Row,
  Table,
  Select,
  Button,
  Checkbox,
  Modal,
  message,
  Popconfirm,
	Rate,
	Upload,
} from "antd";
import Heading from "../Heading/Heading";
import { updateOrderStatus } from "../../../store/orderSlice";
import { removeOrder } from "../../../store/orderSlice";
import Banner from "./images/productpageBanner.png";
import "./Orderpage.css";
import { returnOrder } from "../../../store/orderSlice";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import Loader from "../../Loader/Loader";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const Orderpage = () => {
  const { id } = useParams();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { SingleOrder, SingleOrderloading, SingleOrdererror } = useSelector(
    (state) => state.orders
  );
  const dispatch = useDispatch();
  const [returnarray, setReturnArray] = useState([]);
  const [orderStatus, setOrderStatus] = useState(SingleOrder?.status);
  const [date, setDate] = useState(null);
  const [textarea, setTextarea] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
	const [fileList, setFileList] = useState([]);
  const[fetchedReviewsLoading,setFetchedReviewsLoading]=useState(false)
	const [fetchedReviews, setFetchedReviews] = useState([]);


  useEffect(() => {
    const orderId = id;
    dispatch(fetchOrderById({ apiurl, access_token, orderId }));
    fetchReviews()
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
  console.log("SingleOrder", SingleOrder);
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
    console.log("working ", textarea);

    if (returnarray.length > 0) {
      if (!textarea == "") {
        const returnForm = {
          reson: textarea,
        };

        const array = JSON.stringify(returnarray);

        dispatch(returnOrder({ apiurl, access_token, array, textarea }))
          .unwrap()
          .then(() => {
            const orderId = id;
            dispatch(fetchOrderById({ apiurl, access_token, orderId }));
            setIsModalVisible(false); // Close the modal after submission
          });
      } else {
        message.error("please mension return reson ");
      }
    } else {
      message.error("Please select at least one item to return.");
    }
  };

  const handleCancelEachItem = (itemid) => {
    console.log("itemid", itemid);
    const orderId = itemid;
    dispatch(removeOrderItem({ apiurl, access_token, orderId }))
      .unwrap()
      .then(() => {
        const orderId = id;
        dispatch(fetchOrderById({ apiurl, access_token, orderId }));
        setIsModalVisible(false);
      });
  };

  const dataSource = SingleOrder.items
    ? SingleOrder.items.map((item) => ({
        key: item.id,
        product: item.item,
        id: item.id,
        quantity: item.quantity,
        price: item.total_price,
				reviewid:item.item.id,
        totalorderstatus:item.status
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
  };

  const columns2 = [
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
  ];

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
    /* {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        if (record.key === "total") {
          return null;
        }
        return (
          <Button
            type="primary"
            danger
            onClick={() => handleCancelEachItem(id)}
          >
            Cancel
          </Button>
        );
      },
    },
		*/

    {
      title: "Action",
      dataIndex: "reviewid",
      key: "reviewid",
      render: (reviewid, record) => {
        // Check if the order status is delivered
        const isTotalOrderStatus = SingleOrder?.status === "delivered";//change this 
    
        // Return the button conditionally
        return isTotalOrderStatus ? (
          <Button type="primary" danger onClick={() => handlereviewModel(reviewid)}>
            Add Review
          </Button>
        ) : null; // Return null if the condition is not met
      },
    }
    
  ];

const handlereviewModel=(reviewid)=>{
	console.log("reviewid",reviewid)
setIsReviewModalVisible(true)
	setSelectedProductId(reviewid)
}


const handleReviewSubmit = () => {
  // Ensure the function is called when submitting the review
  console.log("clicked");
  console.log(selectedProductId, reviewText, reviewRating);

  const formData = new FormData();

  // Append basic review data
  formData.append("id", selectedProductId);
  formData.append("review", reviewText);
  formData.append("rating", reviewRating);

  // Append images from fileList to formData
  fileList.forEach((file) => {
    formData.append("images", file.originFileObj); // Use `originFileObj` to access the actual file
  });

  fetch(`${apiurl}/reviews/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`, // Corrected Authorization header syntax
    },
    body: formData,
  })
    .then((res) => res.json()) // Parse JSON response
    .then((data) => {
      setIsReviewModalVisible(false); // Close the review modal
      dispatch(fetchOrderById({ apiurl, access_token, orderId: id })); // Dispatch action to fetch order details
      message.success(data.message); // Display success message
    })
    .catch((err) => {
      console.error("Error submitting review:", err); // Log any error
      message.error("Failed to submit review. Please try again."); // Display error message
    });
};



const fetchReviews = async () => {
  setFetchedReviewsLoading(true)
  try {
    const response = await fetch(`${apiurl}/reviews`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    // setReviews(data);
    setFetchedReviews(data)
    // setFilteredReviews(data);
  } catch (error) {
    message.error("Failed to fetch reviews.");
  } finally {
    // setLoading(false);
    setFetchedReviewsLoading(false)
  }
};


// update reviews
const updateReviewStatus = async (id, status) => {
  try {
    const response = await fetch(
      `${apiurl}/reviews/update?id=${id}&status=${status}`,
      {
        method: "PUT",
      }
    );
    if (response.ok) {
      message.success(`Review status updated to ${status}.`);
      fetchReviews();
    } else {
      throw new Error("Failed to update review status.");
    }
  } catch (error) {
    message.error(error.message);
  }
};






  if (SingleOrderloading) {
    return <Loader />;
  }


  // This function is triggered when a file is uploaded
  const handleImageUpload = (info) => {
    // Get the file list after upload
    let newFileList = [...info.fileList];

    newFileList = newFileList.slice(-5); 

    // Set the file list in the state
    setFileList(newFileList);

    // Check for upload success or error
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Prevent automatic upload, we'll handle the upload ourselves
  const beforeUpload = (file) => {
    // Perform any validation here before file upload (e.g., file size, file type)
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage; // Return false if you want to reject the upload.
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
          <h4 style={{ marginBottom: "20px" }}>
            Status : {SingleOrder?.status}
          </h4>

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

      {/* REVIEW MODULE  */}

      <Modal
        visible={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        onOk={handleReviewSubmit}  
        title="Add Your Review"
      >
        <Rate value={reviewRating} onChange={setReviewRating} />
        <TextArea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
          rows={4}
        />
        <Upload
          beforeUpload={() => false}
          onChange={handleImageUpload}
          listType="picture"
          multiple
          maxCount={5}
        >
          <Button icon={<UploadOutlined/>}>Upload Images</Button>
        </Upload>
      </Modal>

    </>
  );
};

export default Orderpage;
