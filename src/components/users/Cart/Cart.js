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
  Tooltip,
  Spin,
  Flex,
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

  const Navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState("Home");

  // const [storePickup, setStorePickup] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [isPincode, SetIsPincode] = useState(false);

  const [pincode, setPincode] = useState("");

  const [shippingPin, setShippingPin] = useState("");
  const [add, setadd] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [prebookingModel, setPrebookingModel] = useState(false);
  const [prebookingarray, setPrebookingarray] = useState([]);
  const [isPrebooking, setIsPrebooking] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [storePrebookingItemsIds, setStorePrebookingItemsIds] = useState([]);
  const [changeState, setChangeState] = useState(0);
  const [pincodeDetails, setPincodeDetails] = useState(null);

  const [deliveryCharge, setDeliveryCharge] = useState(null);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [discount, setDiscount] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [form] = Form.useForm();
  const [emptycart, SetemptyCart] = useState(true);
  const [razorpapyLoading, setRazorpayLoading] = useState(false);
  const [Updatingloading, setupdatingloading] = useState(false);

  const { constEsitmate, constEstimateloading, constEstimateerror } =
    useSelector((state) => state.shipping);
  const { placingorderloading, placingordererror } = useSelector(
    (state) => state.orders
  );

  const { addresses, addressloading, addresserror } = useSelector(
    (state) => state.address
  );

  useEffect(() => {
    dispatch(fetchUserAddress({ apiurl, access_token }));
    dispatch(fetchCartItems({ apiurl, access_token }));
    dispatch(fetchUserDetails({ apiurl, access_token }));
  }, [access_token]);

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

  const fetchPincodeDetails = async (pincode) => {
    try {
      setPincodeLoading(true);
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (!response.ok || !data || data[0].Status !== "Success") {
        message.error("I think pincode in address may wrong please check it");
      } else {
        console.log("Pincode Details:", data[0].Status);
        setPincodeDetails(data[0]);
        if (data[0].Status === "Success") {
          SetIsPincode(true);
          if (currentStep == 1) {
            next();
          }
        }
        message.success("Pincode details fetched successfully.");
      }
    } catch (err) {
      message.error("Failed to fetch data. Please try again.");
    } finally {
      setPincodeLoading(false);
    }
  };

  useEffect(() => {
    if (isPincode) {
      if (pincodeDetails) {
        const state = pincodeDetails?.PostOffice?.[0]?.State?.replace(
          /\s+/g,
          ""
        )?.toLowerCase();
        const price = Number(items?.discounted_total_price);

        if (price <= 5000) {
          if (pincode >= 500001 && pincode <= 500099) {
            console.log("Amount should be ₹80");
            setDeliveryCharge(80);
          } else if (["andhrapradesh", "telangana"].includes(state)) {
            console.log(
              "The state is Andhra Pradesh or Telangana. Rupees ₹100"
            );
            setDeliveryCharge(100);
          } else {
            console.log(
              "The state is neither Andhra Pradesh nor Telangana. Rupees ₹120"
            );
            setDeliveryCharge(120);
          }
        } else if (price > 5000 && price <= 10000) {
          if (pincode >= 500001 && pincode <= 500099) {
            console.log("Amount should be ₹160");
            setDeliveryCharge(160);
          } else if (["andhrapradesh", "telangana"].includes(state)) {
            console.log(
              "The state is Andhra Pradesh or Telangana. Rupees ₹200"
            );
            setDeliveryCharge(200);
          } else {
            console.log(
              "The state is neither Andhra Pradesh nor Telangana. Rupees ₹240"
            );
            setDeliveryCharge(240);
          }
        } else if (price > 10000) {
          if (pincode >= 500001 && pincode <= 500099) {
            console.log("Amount should be ₹240");
            setDeliveryCharge(240);
          } else if (["andhrapradesh", "telangana"].includes(state)) {
            console.log(
              "The state is Andhra Pradesh or Telangana. Rupees ₹300"
            );
            setDeliveryCharge(300);
          } else {
            console.log(
              "The state is neither Andhra Pradesh nor Telangana. Rupees ₹360"
            );
            setDeliveryCharge(360);
          }
        }

        console.log(
          "items?.discounted_total_price",
          items?.discounted_total_price
        );
        console.log("state", pincodeDetails.PostOffice[0].State);
      }
    }
  }, [isPincode, items, pincodeDetails, pincode]);

  const handleQuantityChange = (id, value, productType, totalitem) => {
    console.log("actual quantity have ", totalitem.product.stock_quantity);
    console.log("total quantity updated ", totalitem.quantity);
    console.log("id", id);

    console.log(
      "id for the cart item is :",
      id,
      "value for the cart item :",
      value
    );

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
    const ChangeInIncrease = validValue - prevValue;
    const isDecreasing = validValue < prevValue;
    const ChangeInDecrease = prevValue - validValue;

    if (isIncreasing) {
      console.log("Quantity is increasing", ChangeInIncrease);
      const updateObj = {
        cart_item_id: id,
        quantity: ChangeInIncrease,
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

  useEffect(() => {
    if (cartItems?.length <= 0) {
      SetemptyCart(true);
    } else {
      SetemptyCart(false);
    }

    const updatedCartData = cartItems?.map((item) => ({
      key: item.id,
      product: item.item,
      color: item.item.color.name,
      price: item.item.price,
      quantity: item.quantity,
    }));
    setCartData(updatedCartData);
  }, [dispatch, cartItems]);

  useEffect(() => {
    if (cartItems?.length >= 0) {
      // Create a new array to track prebooking items
      const updatedPrebookingArray = [];

      cartItems.forEach((item) => {
        const totalItem = item;
        const quantityNeeded = item.quantity;
        const itemId = item.id;

        // Check if quantity needed exceeds stock quantity
        if (Number(quantityNeeded) > Number(totalItem?.item?.stock_quantity)) {
          console.log(
            "Actual quantity available:",
            Number(totalItem.item.stock_quantity),
            "Value entered:",
            Number(quantityNeeded),
            "Pre-booking required.",
            "Extra quantity needed:",
            Number(quantityNeeded) - Number(totalItem.item.stock_quantity)
          );

          // Add or update the prebooking item in the array
          const newItem = {
            id: itemId,
            itemname: totalItem.item.product,
            stock: Number(totalItem.item.stock_quantity),
            Totalstockneed: Number(quantityNeeded),
          };

          updatedPrebookingArray.push(newItem);
        }
      });

      // Update the prebooking array state
      setPrebookingarray((prev) => {
        // Only update the array if there's a change
        if (JSON.stringify(prev) !== JSON.stringify(updatedPrebookingArray)) {
          return updatedPrebookingArray;
        }
        return prev;
      });
    }
  }, [cartItems]);

  // useEffect(() => {

  //   if (cartItems?.length >= 0) {
  //     cartItems.forEach((item) => {
  //       const totalItem = item;
  //       const quantityNeeded = item.quantity;
  //       const itemId = item.id;

  //       if (Number(quantityNeeded) > Number(totalItem?.item?.stock_quantity)) {
  //         console.log(
  //           "Actual quantity available:",
  //           Number(totalItem.item.stock_quantity),
  //           "Value entered:",
  //           Number(quantityNeeded),
  //           "Pre-booking required.",
  //           "Extra quantity needed:",
  //           Number(quantityNeeded) - Number(totalItem.item.stock_quantity)
  //         );

  //         setPrebookingarray((prev) => {
  //           const updatedPrebookingArray = prev ? [...prev] : [];
  //           const existingItemIndex = updatedPrebookingArray.findIndex(
  //             (prebookingItem) => prebookingItem.id === itemId
  //           );
  //           const newItem = {
  //             id: itemId,
  //             itemname: totalItem.item.product,
  //             stock: Number(totalItem.item.stock_quantity),
  //             Totalstockneed: Number(quantityNeeded),
  //           };

  //           if (existingItemIndex !== -1) {
  //             updatedPrebookingArray[existingItemIndex] = newItem;
  //           } else {
  //             updatedPrebookingArray.push(newItem);
  //           }
  //           return updatedPrebookingArray;
  //         });
  //       }

  //     });
  //   }
  // }, [cartItems]);

  const handlePrebooking = () => {
    message.success("We Are proceeding with Pre-Booking quantity");
    setIsPrebooking(true);
    setPrebookingModel(false);
    prebookingarray.map((obj) => {
      storePrebookingItemsIds.push(obj.id);
    });
    console.log("storePrebookingItemsIds", storePrebookingItemsIds);
    next();
    setPrebookingarray([]);
  };

  storePrebookingItemsIds.map((obj) => {
    console.log("storing objes for order", obj);
  });

  const handleContinueWithStock = () => {
    if (!prebookingarray || prebookingarray.length === 0) {
      message.error("No items in prebooking data. Please check and try again.");
      return;
    }

    // Map through the prebookingarray array and create update objects for each item
    const updatePromises = prebookingarray.map((item) => {
      if (!item.id || !item.Totalstockneed || !item.stock) {
        message.error(
          `Invalid data for item: ${item.itemname || "Unknown item"}`
        );
        return Promise.reject();
      }

      const updateObj = {
        cart_item_id: item.id,
        quantity: -(item.Totalstockneed - item.stock),
      };

      // Dispatch updateQuantity for each item
      return dispatch(
        updateQuantity({ apiurl, access_token, updateObj })
      ).unwrap();
    });

    // Execute all updates and handle results
    Promise.all(updatePromises)
      .then(() => {
        setupdatingloading(true);

        // Fetch updated cart items after all updates are successful
        dispatch(fetchCartItems({ apiurl, access_token }))
          .unwrap()
          .then(() => {
            setupdatingloading(false);
            setIsPrebooking(false);
            setPrebookingModel(false);
            message.success(
              "We are continuing with available stock for all items."
            );
            next();
            setPrebookingarray([]);
          })
          .catch((error) => {
            setupdatingloading(false);
            message.error(
              "Failed to fetch updated cart items. Please try again."
            );
            console.error(error);
          });
      })
      .catch((error) => {
        message.error(
          "Failed to update some items. Please check and try again."
        );
        console.error(error);
      });

    // Close the modal regardless of the outcome
    setPrebookingModel(false);
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

  // const handelStorepickup = () => {
  //   setStorePickup((prevState) => !prevState);
  //   if (storePickup === false) {
  //     setSelectedAddress(null);
  //     setDeliveryOption("Store");
  //   }
  //   if (storePickup === true) {
  //     setDeliveryOption(null);
  //   }
  // };

  console.log("deliveryOption", deliveryOption);

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
        console.log(record.product.product);
        return (
          <>
            <InputNumber
              controls
              min={min}
              step={step}
              value={quantity}
              max={1000}
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
            <Modal
              title="Stock Information"
              destroyOnClose
              onCancel={() => setPrebookingModel(false)}
              onClose={() => setPrebookingModel(false)}
              open={prebookingModel}
              footer={[
                <Button key="back" onClick={handleContinueWithStock}>
                  Continue with Available Stock
                </Button>,
                <Button key="submit" type="primary" onClick={handlePrebooking}>
                  Pre-book
                </Button>,
              ]}
            >
              {prebookingarray?.length > 0 ? (
                prebookingarray.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "16px",
                      borderBottom: "1px solid #f0f0f0",
                      paddingBottom: "8px",
                    }}
                  >
                    <p>
                      <strong>Item Name:</strong> {item.itemname}
                    </p>
                    <p>
                      <strong>Total stock available:</strong> {item.stock}
                    </p>
                    <p>
                      <strong>You have entered:</strong> {item.Totalstockneed}{" "}
                      pieces
                    </p>
                    <p>
                      <strong>Shortage:</strong>{" "}
                      {item.Totalstockneed > item.stock
                        ? item.Totalstockneed - item.stock
                        : 0}{" "}
                      pieces
                    </p>
                    <p>
                      Do you want to proceed with pre-booking the extra units?
                    </p>
                    <p>
                      <strong>Note:</strong> Pre-booking order will deliver
                      within 20-25 days.
                    </p>
                  </div>
                ))
              ) : (
                <p>No items available for pre-booking.</p>
              )}
            </Modal>
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

  console.log(" after update prebookingarray", prebookingarray);

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
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 50,
      render: (quantity) => {
        return <span>{quantity}</span>;
      },
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 60,
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

  const showError = () => {
    const msg = message.error("Error in payment please try again.");
    setTimeout(() => {
      msg();
    }, 3000);
  };

  const handlePlaceOrder = async () => {
    setRazorpayLoading(true);
    try {
      const order = await dispatch(
        createOrder({
          apiurl,
          access_token,
          amount: items?.discounted_total_price + (deliveryCharge || 0),
        })
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
        description: "",
        order_id: order.id,
        handler: async (response) => {
          try {
            const Obj = {
              payment_method: "Razorpay",
              pickup_type: deliveryOption,
              payment_status: "success",
              shipping_address: selectedAddress,
              total_discount_price: items?.discounted_total_price,
              shipping_charges: deliveryCharge,
            };
            await dispatch(placeOrder({ apiurl, access_token, Obj }))
              .unwrap()
              .then(() => {
                next();
              });
            message.success("Order Placed Successfully.");
            dispatch(fetchCartItems({ apiurl, access_token }));
            await dispatch(
              paymentStoring({
                apiurl,
                access_token,
                PaymentResponsera: response,
              })
            );
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
        message.success(" open Razorpay modal ");
        setRazorpayLoading(false);
      } catch (error) {
        console.log("Error opening Razorpay modal:", error);
        message.error("Failed to open Razorpay modal.");
        setRazorpayLoading(false);
      }
    } catch (error) {
      showError();
      setRazorpayLoading(false);
    }
  };

  const SelectAddress = (id) => {
    // setStorePickup(false);
    setSelectedAddress(id);
    setDeliveryOption("Home");
  };

  console.log("selectedAddress", selectedAddress);
  // console.log("storePickup", storePickup);

  const handleShipping = () => {
    if (selectedAddress) {
      console.log("selectedAddress", selectedAddress);
      const matchedAddress = addresses?.data?.find(
        (address) => address.id === selectedAddress
      );

      if (matchedAddress?.pincode) {
        setPincode(matchedAddress?.pincode);
        fetchPincodeDetails(matchedAddress?.pincode);
      }
    }
  };

  const ProceedToCheckOut = () => {
    if (prebookingarray?.length > 0) {
      setPrebookingModel(true);
    } else {
      next();
    }
  };

  console.log("emptycart", emptycart);

  return (
    <>
      <div className="Whole_Cart">
        <img
          alt="cndu-prods-banner"
          src="./productpageBanner.png"
          style={{ width: "100%" }}
        ></img>

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
              {false ? (
                <>
                  <img
                    alt="cndu-empty-cart"
                    className="emptycarticon"
                    src="./emptycart.png"
                  />
                  <h2 className="emptycarttext">
                    your cart is empty please add some items to the bag
                  </h2>
                </>
              ) : (
                <>
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
                            <Button
                              onClick={ProceedToCheckOut}
                              className="proceed-button"
                            >
                              Proceed to Checkout
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
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
                        {/* <div className="store-checkbox-container">
                            <label className="checkbox-label">
                              Store pickup
                              <input
                                type="checkbox"
                                checked={storePickup}
                                onChange={handelStorepickup}
                                className="checkbox-input"
                              />
                              <span className="checkbox-disc"></span>
                            </label>
                          </div> */}
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
                {currentStep === 1 && (
                  <Button onClick={handleShipping} primary>
                    Next
                  </Button>
                )}
              </div>

              {}

              {currentStep === 2 && (
                <div className="Row2">
                  {pincodeLoading ? (
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
                          {isPrebooking ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <h4 strong>Pre-Booking Estimated Delivery:</h4>
                              <h5>20-25 days</h5>
                            </div>
                          ) : (
                            <div className="header-line">
                              <h4 strong>Estimated Delivery:</h4>
                              <h5>7-10 days</h5>
                            </div>
                          )}

                          {deliveryOption === "Home" ? (
                            <div className="header-line">
                              <h4 strong>Delivery Address:</h4>
                              <h5>
                                {addresses?.data?.map((address) => {
                                  if (address.id === selectedAddress) {
                                    return address.address;
                                  }
                                })}
                              </h5>
                            </div>
                          ) : (
                            <div className="header-line">
                              <h4 strong>Pickup In Store</h4>
                            </div>
                          )}
                        </div>
                        <div className="table2-products">
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
                          title={
                            <Title
                              level={10}
                              style={{
                                fontWeight: "bold",
                                fontSize: "20px",
                              }}
                            >
                              Order Summary
                            </Title>
                          }
                          bordered={true}
                        >
                          {/* <div>
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
                            </div> */}

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
                          {deliveryCharge && (
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
                                ₹{deliveryCharge}
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
                            <Text strong>Total Net</Text>
                            <Text style={{ color: "green" }}>
                              ₹
                              {items?.discounted_total_price +
                                (deliveryCharge || 0)}
                            </Text>
                          </div>
                          <Tooltip
                            title={
                              razorpapyLoading
                                ? "Your order is being processed"
                                : "Click to place your order"
                            }
                          >
                            <Button
                              onClick={handlePlaceOrder}
                              className="Place_Order_button"
                              loading={razorpapyLoading || placingorderloading}
                              type="primary"
                              aria-label="Place Order"
                            >
                              {razorpapyLoading
                                ? "Processing..."
                                : "Place Order"}
                            </Button>
                          </Tooltip>
                        </Card>
                      </div>
                    </div>
                  )}
                  {}

                  {}
                </div>
              )}

              {currentStep === 2 && !pincodeLoading && (
                <Button onClick={prev} primary>
                  Previous
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
