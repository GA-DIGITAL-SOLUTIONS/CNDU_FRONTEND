import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCartItems, removeCartItem } from "../../../store/cartSlice";
import { fetchProducts } from "../../../store/productsSlice";
import { placeOrder } from "../../../store/orderSlice";
import {
  Card,
  Button,
  Steps,
  Row,
  Col,
  InputNumber,
  Select,
  Table,
  Form,
  List,
  Popconfirm,
  message,
  Input,
  Modal,
} from "antd";
import { TagOutlined } from "@ant-design/icons";
import Heading from "../Heading/Heading";
import "./Cart.css";
import {
  fetchUserAddress,
  updateUserAddress,
  addUserAddress,
  deleteUserAddress,
} from "../../../store/userAdressSlice";
import {
  createOrder,
  paymentStoring,
  paymentSuccess,
} from "../../../store/paymentSlice";

const { Step } = Steps;

const Cart = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const {
    items,
    loading: cartLoading,
    error,
  } = useSelector((state) => state.cart);
  const cartItems = items.items || [];
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const Navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState("Home");
  const [cartData, setCartData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, TotalAmount] = useState(300); //

  // address
  const [selectedAddress, setSelectedAddress] = useState(
    "6-13-52, Street, Giddalur, City: Chappan Brother, State: Andhra Pradesh, Pincode: 523357"
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [form] = Form.useForm();

  const paymentState = useSelector((state) => state.payment);
  const { loading, success, order, paymentResponse } = paymentState;

  useEffect(() => {
    dispatch(fetchUserAddress({ apiurl, access_token }));
    dispatch(fetchCartItems({ apiurl, access_token }));
    dispatch(fetchProducts());
    dispatch(fetchUserAddress({ apiurl, access_token }));
  }, []);

  //payment call
  useEffect(() => {
    if (paymentResponse) {
      // Navigate('/paymentSuccess');
      next();
      console.log(
        "here I need to send the request to the backend to store the data of the order"
      );
      const PaymentData = paymentResponse;
      dispatch(paymentStoring({ apiurl, access_token, PaymentData }));
    } else {
      console.log("pending or rejected");
    }
  }, [paymentResponse, Navigate]); // Run the effect when paymentResponse changes

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const addressData = values;

      if (isEdit) {
        await dispatch(
          updateUserAddress({
            apiurl,
            access_token,
            addressData,
            id: currentAddressId,
          })
        ).unwrap();
      } else {
        await dispatch(
          addUserAddress({ apiurl, access_token, addressData })
        ).unwrap();
      }

      dispatch(fetchUserAddress({ apiurl, access_token }));
      setIsModalVisible(false);
      setIsEdit(false);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (address) => {
    setIsModalVisible(true);
    setIsEdit(true);
    setCurrentAddressId(address.id);
    form.setFieldsValue({
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUserAddress({ apiurl, access_token, id })).unwrap();
      dispatch(fetchUserAddress({ apiurl, access_token }));
      message.success("Address deleted successfully");
    } catch (error) {
      message.error("Failed to delete address");
    }
  };

  // Handle address selection
  const handleAddressChange = (value) => {
    setSelectedAddress(value);
  };

  // useEffect(() => {
  //   if (apiurl && access_token) {
  //     dispatch(fetchCartItems({ apiurl, access_token }));
  //     dispatch(fetchProducts());
  //     dispatch(fetchUserAddress({ apiurl, access_token }));
  //   }
  // }, [dispatch]);

  useEffect(() => {
    const updatedCartData = cartItems.map((item) => ({
      key: item.id,
      product: item.item,
      color: item.item.color.name,
      price: item.item.price,
      quantity: item.quantity || 1,
    }));

    setCartData(updatedCartData);
  }, [cartItems]);

  const { addresses } = useSelector((state) => state.address);
  console.log("Address", addresses.data);

  const handleQuantityChange = (id, value) => {
    setCartData((prevData) =>
      prevData.map((row) =>
        row.key === id ? { ...row, quantity: value > 0 ? value : 1 } : row
      )
    );
  };

  const handleRemove = (id) => {
    const itemId = { cart_item_id: id };
    dispatch(removeCartItem({ apiurl, access_token, itemId }))
      .unwrap()
      .then(() => {
        setCartData((prevData) => prevData.filter((row) => row.key !== id));
      });
  };

  const steps = [
    { title: "Shopping Cart" },
    { title: "Checkout Details" },
    { title: "Order Complete" },
  ];

  const next = () =>
    currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const prev = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  if (cartLoading || productsLoading) return <div>Loading cart items...</div>;
  if (error) return <div>Error: {error}</div>;

  // handling delivery options  const [deliveryOption, setDeliveryOption] = useState('free-shipping');

  // Handle radio button selection change
  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
    console.log("e", e.target.value);
  };

  // Calculate total based on the selected delivery option
  const shippingCost = deliveryOption === "Home" ? 50 : 20;
  const subtotal = 1000;
  const total = subtotal + shippingCost;

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product, record) => {
        const firstImage = product.images?.[0]?.image
          ? `${apiurl}${product.images[0].image}`
          : "no url is getting";
        return (
          <Row className="product-row" align="middle" gutter={[16, 16]}>
            <Col span={6}>
              <img src={firstImage} alt={product.name} />
            </Col>
            <Col span={9}>
              <p className="product-name">{product.name}</p>
              <p className="product-color">Color: {record.color}</p>
              <Button
                type="link"
                danger
                onClick={() => handleRemove(record.key)}
                className="remove-button"
              >
                Remove
              </Button>
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => handleQuantityChange(record.key, value)}
          className="quantity-input"
          controls
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹ ${price}`,
    },
    {
      title: "Subtotal",
      dataIndex: "quantity",
      key: "subtotal",
      render: (quantity, record) => `₹ ${quantity * record.price}`,
    },
  ];

  // payment handling

  const handlePayment = () => {
    // Dispatch createOrder action
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "COD") {
      console.log("cod payment ");
    } else {
      dispatch(createOrder({ apiurl, access_token, amount }))
        .unwrap()
        .then(() => {
          openPaymentInterface();
        });
    }

    // const Obj ={
    //   payment_method:paymentMethod || "COD",
    //   pickup_type:deliveryOption,
    //   payment_status:"success",
    // }

    // dispatch(placeOrder({ apiurl, access_token ,Obj}))
    // .unwrap()
    // .then(() => {
    //   Navigate("/orders");
    //   dispatch(fetchCartItems({ apiurl, access_token }));
    // })
    // .catch((error) => console.log("Order failed:", error));
  };

  const openPaymentInterface = () => {
    if (success) {
      const options = {
        key: process.env.RAZORPAY_PUBLIC_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "CNDU FARBRICS",
        description: "Test Transaction",
        order_id: order.id,
        handler: function (response) {
          dispatch(paymentSuccess(response)); // Handle payment success
        },
        prefill: {
          name: "ameer",
          email: "ameerbasha2@gmail.com",
          contact: "7815869341",
        },
        theme: {
          color: "#3399cc",
        },
      };
      // Create Razorpay payment instance
      const paymentInstance = new window.Razorpay(options);
      paymentInstance.open();
    }
  };

  return (
    <>
      <div className="Whole_Cart">
        <img src="./productpageBanner.png" style={{ width: "100%" }}></img>
        <div className="Cartpage1">
          <Card>
            <Steps current={currentStep}>
              {steps.map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  className={
                    currentStep === index
                      ? "active-step"
                      : currentStep > index
                      ? "completed-step"
                      : "next-step"
                  }
                />
              ))}
            </Steps>
            <div>
              {currentStep === 0 && (
                <Row gutter={16}>
                  <Col xs={24} md={16}>
                    <h3>Shopping Cart</h3>
                    <Table
                      dataSource={cartData}
                      columns={columns}
                      pagination={false}
                      className="cart-table"
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Card title="Cart Summary" className="cart-summary">
                      <div className="coupon-code-wrapper">
                        <TagOutlined />
                        <input type="text" placeholder="Enter coupon code" />
                        <span className="apply-text">Apply</span>{" "}
                      </div>
                      <div
                        className="free-shipping"
                        onClick={() => setDeliveryOption("Home")}
                      >
                        <input
                          type="radio"
                          id="free-shipping"
                          name="delivery-option"
                          value="free-shipping"
                          checked={deliveryOption === "Home"}
                          onChange={handleDeliveryOptionChange}
                        />
                        <label htmlFor="free-shipping">Home</label>
                        <span>₹ 50</span>
                      </div>

                      <div
                        className="pick-up"
                        onClick={() => setDeliveryOption("Store")}
                      >
                        <input
                          type="radio"
                          id="pick-up"
                          name="delivery-option"
                          value="pick-up"
                          checked={deliveryOption === "Store"}
                          onChange={handleDeliveryOptionChange}
                        />
                        <label htmlFor="pick-up">Store</label>
                        <span>₹ 20</span>
                      </div>

                      <div className="subtotal">
                        <span>Subtotal</span>
                        <span>₹ {subtotal}</span>
                      </div>

                      <div className="total">
                        <span>Total</span>
                        <span>₹ {total}</span>
                      </div>

                      <div className="checkout-button">
                        <button onClick={next}>Proceed to Checkout</button>
                      </div>
                    </Card>
                  </Col>
                  {/* <Card className="coupon-card">
                    <h3>Have a Coupon?</h3>
                    <p>Add your code for an instant cart discount</p>
                  </Card> */}
                </Row>
              )}
              {currentStep === 1 && (
                <div className="Pyament_content">
                  {/* Address Card */}
                  <Card title="Select Address" className="address-card">
                    {/* <Select
                      defaultValue={addresses[0]} // Default selected address, e.g., first address in the array
                      style={{ width: "100%" }}
                      onChange={handleAddressChange}
                    >
                      {addresses.data?.map((obj, index) => (
                        <Select.Option key={index} value={obj.address}>
                          {obj.address}
                        </Select.Option>
                      ))}
                    </Select> */}

                    <div className="address-details">
                      {/* <strong style={{}}>Selected Address:</strong> */}
                      {addresses?.data && addresses.data.length > 0 ? (
                        <List
                          grid={{ gutter: 16, column: 1 }}
                          dataSource={addresses.data}
                          renderItem={(item) => (
                            <List.Item>
                              <Card
                                title={item.address}
                                extra={
                                  <div>
                                    <Button
                                      type="link"
                                      onClick={() => handleEdit(item)}
                                    >
                                      Edit
                                    </Button>
                                    <Popconfirm
                                      title="Are you sure you want to delete this address?"
                                      onConfirm={() => handleDelete(item.id)}
                                      okText="Yes"
                                      cancelText="No"
                                    ></Popconfirm>
                                  </div>
                                }
                              >
                                <p>
                                  <strong>City:</strong> {item.city}
                                </p>
                                <p>
                                  <strong>State:</strong> {item.state}
                                </p>
                                <p>
                                  <strong>Pincode:</strong> {item.pincode}
                                </p>
                              </Card>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <p>No addresses available.</p>
                      )}
                    </div>
                  </Card>

                  <Card className="Payment_Card_body">
                    <h3>Payment Method</h3>
                    <div className="radio-group">
                      <input
                        type="radio"
                        id="cash-on-delivery"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={handlePaymentChange}
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        htmlFor="cash-on-delivery"
                        style={{ cursor: "pointer" }}
                      >
                        Cash On Delivery
                      </label>
                    </div>
                    <div className="radio-group">
                      <input
                        type="radio"
                        id="razorpay"
                        name="paymentMethod"
                        value="Razorpay"
                        checked={paymentMethod === "Razorpay"}
                        onChange={handlePaymentChange}
                        style={{ cursor: "pointer" }}
                      />
                      <label htmlFor="razorpay" style={{ cursor: "pointer" }}>
                        Razorpay
                      </label>
                    </div>
                    <Button onClick={handlePlaceOrder}>Place Order</Button>
                  </Card>
                  <div className="Order_Summary">
                    <div class="custom_card">
                      <div class="card-content">
                        <img
                          src="./logo.png"
                          alt="Product"
                          class="card-image"
                        />
                        <div class="card-details">
                          <h3>Product Name</h3>
                          <h4>Product Description</h4>
                          <input
                            type="number"
                            min="1"
                            class="card-input"
                            placeholder="Quantity"
                          />
                        </div>
                        <div class="card-price">₹500</div>
                      </div>
                    </div>
                    Total: ₹1875.00
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div>
                  <Card className="order-summary">
                    <h3>Order Summary</h3>
                    <Button onClick={() => Navigate("/")}>
                      Go to Products
                    </Button>
                  </Card>
                </div>
              )}
            </div>
            <div style={{ marginTop: 20 }}>
              {currentStep > 0 && (
                <Button onClick={prev} style={{ marginRight: "10px" }}>
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 && !currentStep == 0 && (
                <Button onClick={next}>Next</Button>
              )}
            </div>
          </Card>
        </div>
        <Modal
          title={isEdit ? "Edit Address" : "Add Address"}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Please input the address!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please input the city!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please input the state!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="pincode"
              label="Pincode"
              rules={[{ required: true, message: "Please input the pincode!" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Cart;
