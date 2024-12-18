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

import { DeleteOutlined, FlagFilled } from "@ant-design/icons";
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
  const [razorpapyLoading, setRazorpayLoading] = useState(false);
  const [Updatingloading, setupdatingloading] = useState(false);

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

  // useEffect(() => {

  //   if(selectedAddress){
  //     const payload = {
  //       shippingPin: shippingPin,
  //       codOrder: true,
  //     };
  //     dispatch(fetchCostEstimates({ apiurl, access_token, payload }));
  //   }
  // }, [selectedAddress,shippingPin]);

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

    console.log(ChangeInDecrease);

    if (isIncreasing) {
      console.log("Quantity is increasing", ChangeInIncresae);
      const updateObj = {
        cart_item_id: id,
        quantity: ChangeInIncresae,
      };
      dispatch(updateQuantity({ apiurl, access_token, updateObj }))
        .unwrap()
        .then(() => {
          setupdatingloading(true);
          dispatch(fetchCartItems({ apiurl, access_token }))
            .unwrap()
            .then(() => {
              setupdatingloading(false);
            });
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
          setupdatingloading(true);
          dispatch(fetchCartItems({ apiurl, access_token }))
            .unwrap()
            .then(() => {
              setupdatingloading(false);
            });
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
        setupdatingloading(true);
        dispatch(fetchCartItems({ apiurl, access_token }))
          .unwrap()
          .then(() => {
            setupdatingloading(false);
          });
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
  if (cartloading)
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

  const handleShipped = () => {
    console.log(pincode);
    Setpincode(pincode);
    setadd(pincode);
    Setpincode("");
    console.log("add", add);
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
          <div className="product-row" align="middle">
            <div>
              <img src={firstImage} alt={product.name} />
            </div>
            <div>
              <p className="">
                {product.product.length > 10
                  ? `${product.product.substring(0, 10)}...`
                  : product.product}
              </p>

              <p className="product-color">Color: {record.color}</p>
            </div>
          </div>
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
        let isItemDiscount =
          record.product.discount_price < record.product.price;
        let isFabric = record.product.type === "fabric";

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

  const columns2 = [
    {
      title: "Product",
      dataIndex: "product",
      width: 100,
      key: "product",
      render: (product, record) => {
        const firstImage = product.images?.[0]?.image
          ? `${apiurl}${product.images[0].image}`
          : "no url is getting";
        return (
          <div className="coloumn2-product-row" align="middle">
            <div>
              <img src={firstImage} alt={product.name} />
            </div>
            <div>
              <p className="">
                {product.product.length > 10
                  ? `${product.product.substring(0, 10)}...`
                  : product.product}
              </p>

              <p className="product-color">Color: {record.color}</p>
            </div>
          </div>
        );
      },
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 50,

      render: (price, record) => {
        let isItemDiscount =
          record.product.discount_price < record.product.price;
        let isFabric = record.product.type === "fabric";

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
      width: 50,
      render: (quantity, record) => {
        const isFabric = record.product.type === "fabric";
        return `₹ ${quantity * record.product.discount_price}`;
      },
    },
  ];

  console.log("d price", items?.discounted_total_price);
  console.log("error", constEstimateerror);

  const showError = () => {
    const msg = message.error("Error in payment please try again.");
    setTimeout(() => {
      msg();
    }, 3000);
  };
  const handlePlaceOrder = async () => {
    if (selectedAddress) {
      if (!constEstimateerror) {
        if (true) {
          setRazorpayLoading(true);
          try {
            const order = await dispatch(
              createOrder({
                apiurl,
                access_token,
                amount:
                  items?.discounted_total_price +
                  (constEsitmate?.shippingCharges || 0),
              }) // add shipping charges here
            ).unwrap();
            if (!window.Razorpay) {
              message.error("Razorpay SDK is not loaded");
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
                  message.success("Your Payment is  Successful in razorpay");
                  console.log("Payment successful:", response);
                  await dispatch(
                    paymentStoring({
                      apiurl,
                      access_token,
                      PaymentResponsera: response,
                    })
                  );
                  const Obj = {
                    payment_method: paymentMethod || "COD",
                    pickup_type: deliveryOption,
                    payment_status: "success",
                    shipping_address: selectedAddress,
                    total_discount_price: items?.discounted_total_price,
                    shipping_charges: constEsitmate?.shippingCharges,
                  };
                  await dispatch(
                    placeOrder({ apiurl, access_token, Obj })
                  ).unwrap();
                  next();
                  message.success("Your Order is stored data base");
                  dispatch(fetchCartItems({ apiurl, access_token }));
                  await dispatch(paymentSuccess(response));
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

            try {
              paymentInstance.open();
              message.success(" open Razorpay modal. is open ");
              setRazorpayLoading(false);
            } catch (error) {
              console.error("Error opening Razorpay modal:", error);
              message.error("Failed to open Razorpay modal.");
              setRazorpayLoading(false);
            }
          } catch (error) {
            showError();
            setRazorpayLoading(false);
          }
        }
      } else {
        message.error(
          "Not Getting the Delivery Charge at this moment please try again"
        );
      }
    } else {
      message.error("plese select one address");
      setRazorpayLoading(false);
    }
  };

  const SelectAddress = (id) => {
    setSelectedAddress(id);
  };

  console.log("constEsitmate", constEsitmate);

  const handleShipping = () => {
    next();
    if (selectedAddress) {
      console.log("selectedAddress", selectedAddress);
      const matchedAddress = addresses?.data?.find(
        (address) => address.id === selectedAddress
      );
      if (matchedAddress?.pincode) {
        const payload = {
          shippingPin: matchedAddress?.pincode,
          codOrder: true,
        };
        dispatch(fetchCostEstimates({ apiurl, access_token, payload }));
      }
    }
  };

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
                  <div className="cart-page-0-row">
                    <div className="cart-page-0-col main-content">
                      <Table
                        dataSource={cartData}
                        columns={columns}
                        pagination={false}
                        className="cart-table"
                      />
                    </div>
                    <div className="cart-page-0-col side-content">
                      <div className="cart-summary">
                        {Updatingloading ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Spin />
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: "20px",
                            }}
                          >
                            <Text>Total Cart price </Text>
                            <Text>₹ {total}</Text>
                          </div>
                        )}

                        {discount ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: "20px",
                            }}
                          >
                            <Text>Discount Price</Text>
                            <Text style={{ color: "green" }}>
                              - ₹{total - items?.discounted_total_price}
                            </Text>
                          </div>
                        ) : (
                          ""
                        )}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "20px",
                          }}
                        >
                          <Text strong>Total Net Price</Text>
                          <Text style={{ color: "black" }}>
                            ₹{items?.discounted_total_price}
                          </Text>
                        </div>

                        <div className="checkout-button">
                          <Button onClick={next} className="proceed-button">
                            Proceed to Checkout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="Pyament_content">
                    <Card
                      title={
                        <div className="select-addr-card-head">
                          <div>Select Address</div>
                          <div className="Place_Order_button_div">
                            <Button
                              className="Place_Order_button"
                              onClick={() => setIsModalVisible(true)}
                            >
                              Add Address
                            </Button>
                          </div>
                        </div>
                      }
                      className="address-card"
                    >
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
                                  <div>
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
                                      type="text"
                                      onClick={() => handleEdit(item)}
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
                      </div>
                    </Card>
                  </div>
                )}
                <div className="prev_next_but">
                  {currentStep === 1 && (
                    <Button onClick={prev} primary>
                      Previous
                    </Button>
                  )}
                  {currentStep === 1 && SelectAddress && (
                    <Button onClick={handleShipping} primary>
                      Next
                    </Button>
                  )}
                </div>

                {}

                {currentStep === 2 && (
                  <div className="Row2">
                    {constEstimateloading ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Spin />
                      </div>
                    ) : (
                      <div className="step3">
                        <div className="delivery-address-products">
                        <div className="delivery-address-card">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems:"center"

                              }}
                            >
                              <h4 strong>Estimated Delivery:</h4>
                              <h5
                              >
                                7-10 days
                              </h5>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems:"center"
                              }}
                            >
                              <h4 strong>Delivery Address:</h4>
                              <h5
                              >
                                {addresses?.data?.map((address) => {
                                  if (address.id === selectedAddress) {
                                    return address.address;
                                  }
                                })}
                              </h5>
                            </div>
                          </div>
                        <div
                          className="table2-products"
                        >
                          <Table
                            dataSource={cartData}
                            columns={columns2}
                            pagination={false}
                            className="cart-table2"
                          />
                        </div>

                        </div>
                        <div className="Order_Summary_container">
                          
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

                            {constEsitmate && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginTop: "20px",
                                }}
                              >
                                <Text strong style={{ color: "black" }}>
                                  Delivery Charges
                                </Text>
                                <Text style={{ color: "black" }}>
                                  ₹{constEsitmate?.shippingCharges}
                                </Text>
                              </div>
                            )}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "20px",
                              }}
                            >
                              <Text strong>Actual Total</Text>
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
                              </>
                            ) : (
                              ""
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
                            <Button
                              onClick={handlePlaceOrder}
                              className="Place_Order_button"
                              loading={razorpapyLoading} // Show spinner when loading is true
                            >
                              {razorpapyLoading
                                ? "Processing..."
                                : "Place Order"}
                            </Button>
                          </Card>
                        </div>
                      </div>
                    )}
                    {}

                    {}
                  </div>
                )}

                {currentStep === 2 && !constEstimateloading && (
                  <Button onClick={prev} primary>
                    Previous Page
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
