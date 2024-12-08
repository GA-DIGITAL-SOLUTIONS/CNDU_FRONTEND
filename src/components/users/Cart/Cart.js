import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCartItems,
  removeCartItem,
  updateQuantity,
} from "../../../store/cartSlice";
import { fetchProducts } from "../../../store/productsSlice";
import {} from "antd";

import { placeOrder } from "../../../store/orderSlice";
import {
  Card,
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
  Divider,
  Typography,
  Collapse,
  Button,
} from "antd";
import "antd/dist/reset.css"; // Ensure Ant Design styles are reset.

import { TagOutlined, DeleteOutlined } from "@ant-design/icons";
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
  toggleOrder,
  toggleSuccess,
} from "../../../store/paymentSlice";

const { Step } = Steps;
const { Text, Title } = Typography;
const { Panel } = Collapse;

const Cart = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const {
    items,
    loading: cartLoading,
    error,
  } = useSelector((state) => state.cart);
  const cartItems = items.items || [];
  const [cartobj, setcartobj] = useState(null);
  const Navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState("Home");
  const [cartData, setCartData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, TotalAmount] = useState(300); 
  const [pincode, Setpincode] = useState(""); 
  const [add, setadd] = useState("");

  console.log("cartitems", items);
  

  // address
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [discount, setDiscount] = useState(false);
  const [itemdiscount, setItemDiscount] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [form] = Form.useForm();
  const [emptycart,SetemptyCart]=useState(true)

  const { loading, orderCreated, order, paymentResponse, RazorpaySuccess } =
    useSelector((state) => state.payment);
  console.log("outside function orederCreated", orderCreated);

  useEffect(() => {
    dispatch(fetchUserAddress({ apiurl, access_token }));
    dispatch(fetchCartItems({ apiurl, access_token }));
    dispatch(fetchUserAddress({ apiurl, access_token }));
  }, [access_token]);

  useEffect(() => {
    if (items.total_price != items.discounted_total_price) {
      console.log("totalcartprice", items.total_price);
      console.log("totalcartDiscountprice", items.total_price);
      setDiscount(true);
    }
  }, [dispatch, items]);

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

  useEffect(() => {
    if (cartItems.length > 0) {

      SetemptyCart(false)

      const updatedCartData = cartItems.map((item) => ({
        key: item.id,
        product: item.item,
        color: item.item.color.name,
        price: item.item.price,
        quantity: item.quantity,
      }));
      setCartData(updatedCartData);
    }
  }, [cartItems]);

  const { addresses } = useSelector((state) => state.address);

  // console.log("Address", addresses.data);

  const handleQuantityChange = (id, value, productType, totalitem) => {
    console.log("totalitem", totalitem.product.stock_quantity);
    console.log("id", id);

    console.log("id for the cart item,", id, "value for the cart item", value);

    // Determine the minimum and step based on product type
    let min = 1;
    let step = 1;

    if (productType === "fabric") {
      min = 0.5;
      step = 0.5;
    } else if (productType === "product") {
      min = 1;
      step = 1;
    }
    const validValue = value >= min ? Math.round(value / step) * step : min;

    const prevValue = cartData.find((row) => row.key === id)?.quantity || 0;

    // Determine if the value is increasing or decreasing

    const isIncreasing = validValue > prevValue;
    const ChangeInIncresae = validValue - prevValue;
    const isDecreasing = validValue < prevValue;
    const ChangeInDecrease = prevValue - validValue;

    // Log or perform actions based on whether the quantity is increasing or decreasing
    if (isIncreasing) {
      console.log("Quantity is increasing", ChangeInIncresae);
      const updateObj = {
        cart_item_id: id, // id of the indivudal cart item id
        quantity: ChangeInIncresae,
      };
      dispatch(updateQuantity({ apiurl, access_token, updateObj }))
        .unwrap()
        .then(() => {
          dispatch(fetchCartItems({ apiurl, access_token }));
        });
    } else if (isDecreasing) {
      console.log("Quantity is decreasing", ChangeInDecrease);
      const updateObj = {
        cart_item_id: id,
        quantity: -ChangeInDecrease, // decresing here "-"
      };
      dispatch(updateQuantity({ apiurl, access_token, updateObj }))
        .unwrap()
        .then(() => {
          dispatch(fetchCartItems({ apiurl, access_token }));
        });
    }
    // Update the cart data with the new valid quantity

    setCartData((prevData) =>
      prevData.map((row) =>
        row.key === id ? { ...row, quantity: validValue } : row
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

  if (error) return <div>Error: {error}</div>;

  // handling delivery options  const [deliveryOption, setDeliveryOption] = useState('free-shipping');

  // Handle radio button selection change
  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
    setadd("");
  };
  const handleShipment = (e) => {
    console.log(e.target.value);
    Setpincode(e.target.value);
    setadd("");
  };

  const handleShipped = () => {
    console.log(pincode);
    Setpincode(pincode);
    setadd(pincode);
    Setpincode("");
    console.log("add", add);
  };

  // handleShipping

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
    console.log("e", e.target.value);
  };

  // Calculate total based on the selected delivery option
  const shippingCost = deliveryOption === "Home" ? 50 : 20;
  // const subtotal = 1000;
  const total = items.total_price + shippingCost;
  const columns = [
    {
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <DeleteOutlined
            className="cart_delete"
            onClick={() => handleRemove(record.key)} // Trigger the remove action
          />
        );
      },
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product, record) => {
        const firstImage = product.images?.[0]?.image
          ? `${apiurl}${product.images[0].image}`
          : "no url is getting";
        return (
          <Row className="product-row" align="middle" gutter={[6, 6]}>
            <Col span={6}>
              <img src={firstImage} alt={product.name} />
            </Col>
            <Col span={9}>
              <p className="">{product.product}</p>
              <p className="product-color">Color: {record.color}</p>
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
        const isFabric = record.product.type === "fabric";
        const min = isFabric ? 0.5 : 1; // Min value depends on type
        const step = isFabric ? 0.5 : 1; // Step value depends on type

        return (
          <>
            <InputNumber
              controls
              min={min}
              step={step}
              value={quantity}
              max={record.product.stock_quantity}
              onChange={(value) =>
                handleQuantityChange(
                  record.key,
                  value,
                  record.product.type,
                  record
                )
              }
              className="quantity-input"
            />
            {isFabric && <span> meters</span>}{" "}
            {/* Show "per meter" for fabric */}
          </>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price, record) => {
        const isItemDiscount =
          record.product.discount_price != record.product.price;
        const isFabric = record.product.type === "fabric";

        return (
          <div>
            {isItemDiscount ? (
              <div>
                {/* Strike off the original price */}
                <span style={{ textDecoration: "line-through", color: "red" }}>
                  ₹ {record.product.price}
                </span>
                <br />
                {/* Show discounted price below */}
                <span style={{ color: "green", fontWeight: "bold" }}>
                  ₹ {record.product.discount_price}
                </span>
              </div>
            ) : (
              <div>
                {/* Show regular price if no discount */}
                <span>₹ {record.product.price}</span>
              </div>
            )}
            {/* Add per meter text if it's a fabric */}
            {isFabric && <span> per/meter</span>}
          </div>
        );
      },
    },
    {
      title: "Subtotal",
      dataIndex: "quantity",
      key: "subtotal",
      render: (quantity, record) => {
        const isFabric = record.product.type === "fabric";
        return `₹ ${quantity * record.price}`;
      },
    },
  ];

  // payment handling

  const handlePlaceOrder = async () => {
    if (selectedAddress) {
      if (paymentMethod === "COD") {
        const Obj = {
          payment_method: paymentMethod || "COD",
          pickup_type: deliveryOption,
          payment_status: "success",
          shipping_address: selectedAddress, // Ensure selectedAddress is valid
        };
        try {
          await dispatch(placeOrder({ apiurl, access_token, Obj })).unwrap();
          next(); // Proceed to the next step
          dispatch(fetchCartItems({ apiurl, access_token })); // Refresh cart
        } catch (error) {
          console.error("COD order failed:", error);
        }
      } else if (paymentMethod === "Razorpay") {
        try {
          const order = await dispatch(
            createOrder({ apiurl, access_token, amount: items.total_price })
          ).unwrap();

          if (!window.Razorpay) {
            console.error("Razorpay SDK is not loaded");
            return;
          }
          if (process.env.RAZORPAY_PUBLIC_KEY) {
            console.error("key is not there is that ");
            return;
          }
          const options = {
            key: process.env.RAZORPAY_PUBLIC_KEY,
            amount: order.amount,
            currency: order.currency,
            name: "CNDU FABRICS",
            description: "Test Transaction",
            order_id: order.id,
            handler: async (response) => {
              try {
                console.log("Payment successful:", response);
                await dispatch(
                  paymentStoring({
                    apiurl,
                    access_token,
                    PaymentResponsera: response,
                  })
                );
                await dispatch(paymentSuccess(response));
                const Obj = {
                  payment_method: paymentMethod || "COD",
                  pickup_type: deliveryOption,
                  payment_status: "success",
                  shipping_address: selectedAddress,
                };
                await dispatch(
                  placeOrder({ apiurl, access_token, Obj })
                ).unwrap();
                next();
                dispatch(fetchCartItems({ apiurl, access_token }));
              } catch (error) {
                console.error("Error during post-payment processing:", error);
              }
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

          const paymentInstance = new window.Razorpay(options);
          paymentInstance.open();
        } catch (error) {
          console.error("Error creating order or initializing payment:", error);
        }
      }
    } else {
      message.error("plese select one address");
    }
  };

  const SelectAddress = (id) => {
    console.log(id);
    setSelectedAddress(id);
  };


  return (
    <>
      <div className="Whole_Cart">
        <img src="./productpageBanner.png" style={{ width: "100%" }}></img>
        {emptycart?"":
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
                  <Table
                    dataSource={cartData}
                    columns={columns}
                    pagination={false}
                    className="cart-table"
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Card title="Cart Summary" className="cart-summary">
                   
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
                    {deliveryOption === "Home" && (
                      <div
                        className="coupon-code-wrapper pincode"
                        style={{ marginBottom: "20px" }}
                      >
                        <input
                          type="text"
                          value={pincode}
                          name="pincode"
                          placeholder="Enter Pin code"
                          onChange={handleShipment}
                        />
                        <span className="apply-text" onClick={handleShipped}>
                          Apply
                        </span>{" "}
                      </div>
                    )}

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

                   

                    <div className="total">
                      <span>Total</span>
                      <span>₹ {total}</span>
                    </div>

                    {discount ? (
                      <div className="total">
                        <span>Discount price</span>
                        <span style={{ color: "green" }}>
                          {" "}
                          - ₹{items?.discounted_total_price}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}

                    <div>
                      {add && deliveryOption === "Home" && (
                        <h4 style={{ textAlign: "center" }}>
                          Shipping Pin : {add}{" "}
                        </h4>
                      )}
                    </div>

                    <div className="checkout-button">
                      <button onClick={next}>Proceed to Checkout</button>
                    </div>
                  </Card>
                </Col>
               
              </Row>
            )}
            {currentStep === 1 && (
              <div className="Pyament_content">
                <Card title="Select Address" className="address-card">
                  <div className="address-details">
                    <div>
                      {addresses?.data && addresses.data.length > 0 ? (
                        <Collapse accordion>
                          {addresses.data.map((item) => (
                            <Panel
                              key={item.id}
                              header={
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span>{item.address}</span>

                                  <input
                                    type="radio"
                                    checked={selectedAddress === item.id}
                                    onChange={() => SelectAddress(item.id)}
                                    style={{
                                      accentColor: "#f24c88",
                                      width: "18px",
                                      height: "18px",
                                    }}
                                  />
                                </div>
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <div>
                                  <p>
                                    <strong>City:</strong> {item.city}
                                  </p>
                                  <p>
                                    <strong>State:</strong> {item.state}
                                  </p>
                                  <p>
                                    <strong>Pincode:</strong> {item.pincode}
                                  </p>
                                </div>

                                <Button
                                  type="link"
                                  onClick={() => handleEdit(item)}
                                  style={{ color: "white", backgroundColor:"#f24c88" }}
                                >
                                  Edit
                                </Button>
                              </div>
                            </Panel>
                          ))}
                        </Collapse>
                      ) : (
                        <p>No addresses available.</p>
                      )}
                    </div>
                  </div>
                </Card>

                <div className="Row2">
                  <div className="Order_Summary">
                    <Card
                      className="OrderSummary"
                      title={<Title level={4}>Order Summary</Title>}
                      bordered={true}
                    >
                      <div>
                        <Text strong>Total Items: </Text>
                        <Text style={{ float: "right", fontSize: "1em" }}>
                          {items.items.length}
                        </Text>
                      </div>
                      <div className="total">
                        <span>Total</span>
                        <span>₹ {total}</span>
                      </div>

                      {discount ? (
                        <div className="total">
                          <span>Discount price</span>
                          <span style={{ color: "green" }}>
                            {" "}
                            - ₹{items?.discounted_total_price}
                          </span>
                        </div>
                      ) : (
                        ""
                      )}

                      <Divider />
                      <div></div>
                      <Divider />
                      <div>
                        <Text strong>Shipping Address:</Text>
                        <Text style={{ display: "block", marginTop: "8px" }}>
                        </Text>
                      </div>
                    </Card>
                   
                  </div>
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
                    <Button
                      onClick={handlePlaceOrder}
                      className="Place_Order_button"
                    >
                      Place Order
                    </Button>
                  </Card>
                </div>
              </div> // total cart body
            )}
            {currentStep === 2 && (
              <div>
                <Card className="order-summary">
                  <h3>You Have successfully Placed the Order</h3>
                  <Button onClick={() => Navigate("/profile")}>Go to Home</Button>
                </Card>
              </div>
            )}
          </div>
          <div style={{ marginTop: 20 }}>
            
          </div>
        </Card>
      </div>
        }
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
