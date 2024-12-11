import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCartItems,
  removeCartItem,
  updateQuantity,
} from "../../../store/cartSlice";

import { placeOrder } from "../../../store/orderSlice";
import {
  Card,
  Steps,
  Row,
  Col,
  InputNumber,
  Table,
  Form,
  message,
  Input,
  Modal,
  Divider,
  Typography,
  Collapse,
  Button,
  Spin,
} from "antd";
import "antd/dist/reset.css";

import { DeleteOutlined } from "@ant-design/icons";
import "./Cart.css";
import {
  fetchUserAddress,
  updateUserAddress,
  addUserAddress,
} from "../../../store/userAdressSlice";
import {
  createOrder,
  paymentStoring,
  paymentSuccess,
} from "../../../store/paymentSlice";

import Loader from "../../Loader/Loader";
import { fetchUserDetails } from "../../../store/userInfoSlice";
import {
  fetchTimeEstimates,
  fetchCostEstimates,
} from "../../../store/shipmentSlice";

const { Step } = Steps;
const { Text, Title } = Typography;
const { Panel } = Collapse;

const Cart = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { items, cartloading, carterror } = useSelector((state) => state.cart);
  const { user, userdatasloading, userdataerror } = useSelector(
    (state) => state.user
  );
  console.log("user", user);

  const {} = useSelector((state) => state.shipping);

  const Navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState("Home");
  const [cartData, setCartData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [pincode, Setpincode] = useState("");
  const [shippingPin, setShippingPin] = useState("");
  const [add, setadd] = useState("");
  const [cartItems, setCartItems] = useState([]);

  console.log("cartitems", items);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [discount, setDiscount] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [form] = Form.useForm();
  const [emptycart, SetemptyCart] = useState(true);

  const { loading, orderCreated, order, paymentResponse, RazorpaySuccess } =
    useSelector((state) => state.payment);

  const { constEsitmate, constEstimateloading, constEstimateerror } =
    useSelector((state) => state.shipping);

  const { addresses, addressloading, addresserror } = useSelector(
    (state) => state.address
  );

  console.log("outside function orederCreated", orderCreated);

  useEffect(() => {
    dispatch(fetchUserAddress({ apiurl, access_token }));
    dispatch(fetchCartItems({ apiurl, access_token }));
    dispatch(fetchUserDetails({ apiurl, access_token }));
  }, [access_token]);

  useEffect(() => {
    const payload = {
      shippingPin: shippingPin,
      codOrder: true,
    };
    dispatch(fetchCostEstimates({ apiurl, access_token, payload }));
    // dispatch(fetchTimeEstimates({ apiurl, access_token, payload }));
  }, [selectedAddress]); // when the shippingPin is changes

  useEffect(() => {
    setCartItems(items.items);
    if (items.total_price !== items.discounted_total_price) {
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

  useEffect(() => {
    if (cartItems?.length > 0) {
      SetemptyCart(false);

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

  useEffect(() => {
    if (selectedAddress) {
      const matchedAddress = addresses?.data?.find(
        (address) => address.id === selectedAddress
      );
      if (matchedAddress?.pincode) {
        setShippingPin(matchedAddress.pincode);
      }
    }
  }, [selectedAddress, addresses, setShippingPin]);

  console.log("addresses", addresses);

  const handleQuantityChange = (id, value, productType, totalitem) => {
    console.log("totalitem", totalitem.product.stock_quantity);
    console.log("id", id);

    console.log("id for the cart item,", id, "value for the cart item", value);

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

    const isIncreasing = validValue > prevValue;
    const ChangeInIncresae = validValue - prevValue;
    const isDecreasing = validValue < prevValue;
    const ChangeInDecrease = prevValue - validValue;

    if (isIncreasing) {
      console.log("Quantity is increasing", ChangeInIncresae);
      const updateObj = {
        cart_item_id: id,
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
        quantity: -ChangeInDecrease,
      };
      dispatch(updateQuantity({ apiurl, access_token, updateObj }))
        .unwrap()
        .then(() => {
          dispatch(fetchCartItems({ apiurl, access_token }));
        });
    }

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
    { title: "Select address" },
    { title: "Checkout Details" },
    { title: "Order Complete" },
  ];

  const next = () =>
    currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const prev = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  // if (cartloading) return <div style={{margin:"90vh auto"}}><Loader /></div>;
  if (userdatasloading)
    return (
      <div style={{ margin: "90vh auto" }}>
        <Loader />
      </div>
    );
  if (addresserror)
    return (
      <div style={{ margin: "90vh auto" }}>
        <Loader />
      </div>
    );

  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
    setadd("");
  };
  const handleShipment = (e) => {
    console.log(e.target.value);
    Setpincode(e.target.value);
    setadd("");
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
    console.log("e", e.target.value);
  };

  const total = items.total_price;
  const columns = [
    {
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <DeleteOutlined
            className="cart_delete"
            onClick={() => handleRemove(record.key)}
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
        const min = isFabric ? 0.5 : 1;
        const step = isFabric ? 0.5 : 1;

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
            {isFabric && <span> meters</span>}
          </>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price, record) => {
        console.log("record", record);

        console.log("price", record.product.price);
        console.log("discountprice", record.product.discount_price);

        let isItemDiscount =
          record.product.discount_price < record.product.price;
        let isFabric = record.product.type === "fabric";

        console.log("isItemDiscount", isItemDiscount);
        console.log("isfabric", isFabric);

        return (
          <div>
            {isItemDiscount ? (
              <div>
                <span style={{ textDecoration: "line-through", color: "red" }}>
                  ₹ {record.product.price}
                </span>
                <br />
                <span style={{ color: "green", fontWeight: "bold" }}>
                  ₹ {record.product.discount_price}
                </span>
              </div>
            ) : (
              <div>
                <span>₹ {record.product.price}</span>
              </div>
            )}
            {isFabric && <span> per meter</span>}
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

        return `₹ ${quantity * record.product.discount_price}`;
      },
    },
  ];

  const handlePlaceOrder = async () => {
    if (selectedAddress) {
      if(paymentMethod){
      if (paymentMethod === "COD") {
        const Obj = {
          payment_method: paymentMethod || "COD",
          pickup_type: deliveryOption,
          payment_status: "success",
          shipping_address: selectedAddress,
        };
        try {
          await dispatch(placeOrder({ apiurl, access_token, Obj })).unwrap();
          next();
          dispatch(fetchCartItems({ apiurl, access_token }));
        } catch (error) {
          console.error("COD order failed:", error);
        }
      } else if (paymentMethod === "Razorpay") {
        try {
          const order = await dispatch(
            createOrder({
              apiurl,
              access_token,
              amount: items.discounted_total_price,
            }) // add shipping charges here
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
              name: user.username,
              email: user.email,
              contact: user.phone_number,
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
    }else{
      message.error("plese select Payment Method");

    }

    } else {
      message.error("plese select one address");
    }
  };

  const SelectAddress = (id) => {
    setSelectedAddress(id);
  };

  console.log("constEsitmate", constEsitmate?.shippingCharges);

  return (
    <>
      <div className="Whole_Cart">
        <img
          alt="cndu-prods-banner"
          src="./productpageBanner.png"
          style={{ width: "100%" }}
        ></img>
        {emptycart ? (
          <>
            <img
              alt="cndu-empty-cart"
              className="emptycarticon"
              src="./emptycart.png"
            />
            <h2 className="emptycarttext">
              your cart is empty plase add some items to the bag
            </h2>
          </>
        ) : (
          <div className="Cartpage1">
            <div className="steps-cont">
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
              <div className="steps-content">
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
                      <div className="cart-summary">
                        {/* <div
													className="free-shipping"
													onClick={() => setDeliveryOption("Home")}>
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
												</div> */}
                        {/* {deliveryOption === "Home" && (
													<div
														className="coupon-code-wrapper pincode"
														style={{ marginBottom: "20px" }}>
														<input
															type="text"
															value={pincode}
															name="pincode"
															placeholder="Enter Pin code"
															onChange={handleShipment}
														/>
														<span
															className="apply-text"
															onClick={handleShipped}>
															Apply
														</span>{" "}
													</div>
												)}

												<div
													className="pick-up"
													onClick={() => setDeliveryOption("Store")}>
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
												</div> */}

                        <div className="total">
                          <div className="totalitem">
                            <span>Total Cart price </span>
                            <span>₹ {total}</span>
                          </div>
                        </div>
                        {discount ? (
                          <div className="total">
                            <div className="totalitem">
                              <span>Discount Price</span>
                              <span style={{ color: "green" }}>
                                {" "}
                                - ₹{total - items?.discounted_total_price}
                              </span>
                            </div>
                            <div className="totalitem">
                              <span>Total Net Price</span>
                              <span style={{ color: "black" }}>
                                {" "}
                                ₹
                                {items?.discounted_total_price +
                                  constEsitmate?.shippingCharges}
                              </span>
                            </div>
                            :
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
                      </div>
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
                                      style={{
                                        color: "white",
                                        backgroundColor: "#f24c88",
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  </div>
                                </Panel>
                              ))}
                            </Collapse>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="Place_Order_button_div">
                          <Button
                            className="Place_Order_button"
                            onClick={() => setIsModalVisible(true)}
                          >
                            Add Address
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
                <div className="prev_next_but">
                  {currentStep === 1 && (
                    <Button onClick={prev} primary>
                      Previous page
                    </Button>
                  )}
                  {currentStep === 1 && SelectAddress && (
                    <Button onClick={next} primary>
                      Next page
                    </Button>
                  )}
                </div>

                {/* {constEstimateloading ? "" :
                } */}

                {currentStep == 2 &&  (
                  <div className="Row2">
                    <div className="Order_Summary_container">
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
                          <label
                            htmlFor="razorpay"
                            style={{ cursor: "pointer" }}
                          >
                            Razorpay
                          </label>
                        </div>

                        <div>
                          <Text strong>Shipping Address:</Text>
                          <Text style={{ display: "block", marginTop: "8px" }}>
                            {addresses?.data?.map((address) => {
                              if (address.id === selectedAddress) {
                                return address.address;
                              }
                            })}
                          </Text>
                        </div>
                       
                      </Card>

                      <Card
                        className="OrderSummary"
                        title={<Title level={4}>Order Summary</Title>}
                        bordered={true}
                      >
                        <div>
                          <Text strong>Total Items:</Text>
                          <Text style={{ float: "right", fontSize: "1em" }}>
                            {(() => {
                              let sum = 0;
                              let count = 0;
                              for (let i = 0; i < items.items.length; i++) {
                                const currentItem = items.items[i];
                                console.log(
                                  "item.item.type",
                                  currentItem.item.type
                                );
                                if (currentItem.item.type === "fabric") {
                                  count += 1;
                                } else if (
                                  currentItem.item.type === "product"
                                ) {
                                  sum += currentItem.quantity;
                                }
                              }
                              console.log("count", typeof count);
                              console.log("sum", typeof sum);
                              return Number(sum) + count;
                            })()}
                          </Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "20px",
                          }}
                        >
                          <Text strong>Acutal Total</Text>
                          <Text strong>₹ {total}</Text>
                        </div>
                        {discount ? (
                          <>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "20px",
                              }}
                            >
                              <Text strong>Discount price</Text>
                              <Text style={{ color: "green" }}>
                                - ₹{total - items?.discounted_total_price}
                              </Text>
                            </div>
                            {constEsitmate?.shippingCharges && (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "20px",
                                  }}
                                >
                                  <Text strong> Delivery Charges</Text>
                                  <Text style={{ color: "gray" }}>
                                     ₹{constEsitmate?.shippingCharges}
                                  </Text>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "20px",
                                  }}
                                >
                                  <Text strong>Estimated Delivery </Text>
                                  <Text style={{ color: "gray" }}>
                                     {constEsitmate?.estimatedDeliveryDate}
                                  </Text>
                                </div>
                              </>
                            )}

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "20px",
                              }}
                            >
                              <Text strong>Total Net</Text>
                              <Text style={{ color: "green" }}>
                                ₹
                                {items?.discounted_total_price +
                                  constEsitmate?.shippingCharges}
                              </Text>
                            </div>
                          </>
                        ) : (
                          ""
                        )}

                        <Divider />
                        <Divider />

                        {/* <div>
                            <Text strong>Shipping Address:</Text>
                            <Text
                              style={{ display: "block", marginTop: "8px" }}
                            >
                              {addresses?.data?.map((address) => {
                                if (address.id === selectedAddress) {
                                  return address.address;
                                }
                              })}
                            </Text>
                          </div>
                          <div>
                            <Text strong>Estimated Date:</Text>
                            <Text
                              style={{ display: "block", marginTop: "8px" }}
                            >
                              show Estimated Date here 
                            </Text>
                          </div> */}
                        <Button
                          onClick={handlePlaceOrder}
                          className="Place_Order_button"
                        >
                          Place Order
                        </Button>
                      </Card>
                    </div>
                    {/* <Card className="Payment_Card_body">
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
                          <label
                            htmlFor="razorpay"
                            style={{ cursor: "pointer" }}
                          >
                            Razorpay
                          </label>
                        </div>
                        <Button
                          onClick={handlePlaceOrder}
                          className="Place_Order_button"
                        >
                          Place Order
                        </Button>
                      </Card> */}

                    {/* {selectedAddress &&
                        addresses?.data?.map((address) => {
                          if (address.id === selectedAddress) {
                            return address.pincode ? (
                              <strong key={address.id}>
                                Selected Pin Code: <h1>{shippingPin}</h1>
                              </strong>
                            ) : null; // Fallback when pincode doesn't exist
                          }
                          return null; // Return null when the address doesn't match selectedAddress
                        })}

                      {constEstimateloading ? (
                        <Spin tip="Loading..." />
                      ) : constEstimateerror ? (
                        <p style={{ color: "red" }}>
                          Error: {constEstimateerror}
                        </p>
                      ) : (
                        <p>
                          Shipping Charges:{" "}
                          {constEsitmate?.shippingCharges || "Not Available"}
                        </p>
                      )}  */}
                  </div>
                )}
                {currentStep === 2 && (
                  <Button onClick={prev} primary>
                    previous page
                  </Button>
                )}
                {currentStep === 3 && (
                  <div>
                    <Card className="order-summary">
                      <h3>You Have successfully Placed the Order</h3>
                      <Button onClick={() => Navigate("/profile")}>
                        Go to Profile for Orders
                      </Button>
                    </Card>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 20 }}></div>
            </div>
          </div>
        )}
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
