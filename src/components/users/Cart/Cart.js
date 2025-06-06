import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  fetchCartItems,
  removeCartItem,
  updateQuantity,
} from "../../../store/cartSlice";

import { placeOrder } from "../../../store/orderSlice";
import {
  Card,
  Steps,
  InputNumber,
  Table,
  Form,
  message,
  Input,
  Modal,
  Typography,
  Collapse,
  Button,
  Tooltip,
  Spin,
  Select,
} from "antd";
import "antd/dist/reset.css";

import { ApiFilled, DeleteOutlined, FlagFilled } from "@ant-design/icons";
import "./Cart.css";
import {
  fetchUserAddress,
  updateUserAddress,
  addUserAddress,
} from "../../../store/userAdressSlice";
import { createOrder } from "../../../store/paymentSlice";

import Loader from "../../Loader/Loader";
import { fetchUserDetails } from "../../../store/userInfoSlice";
import emptycartimg from "./emptycart.png";

const { Step } = Steps;
const { Text, Title } = Typography;
const { Panel } = Collapse;

const Cart = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { items, cartloading } = useSelector((state) => state.cart);

  const { user, userdatasloading } = useSelector((state) => state.user);

  const Navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState("Home");

  const [cartData, setCartData] = useState([]);

  const [isPincode, SetIsPincode] = useState(false);

  const [pincode, setPincode] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [prebookingModel, setPrebookingModel] = useState(false);
  const [noStockModel, setNoStockModel] = useState(false);
  const [reduceStockModel, setReduceStockModel] = useState(false);

  const [preBookingItemNames, setPrebookingItemNames] = useState([]);

  const [prebookingarray, setPrebookingarray] = useState([]);
  const [isPrebooking, setIsPrebooking] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [storePrebookingItemsIds, setStorePrebookingItemsIds] = useState([]);
  const [outofStockArray, setOutofStockArray] = useState([]);
  const [reduceStockArray, setReduceStockArray] = useState([]);
  // const [amount, setAmount] = useState("");
  // const [redirectUrl, setRedirectUrl] = useState('');
  // const [error, setError] = useState("");

  const [pincodeDetails, setPincodeDetails] = useState(null);

  const [deliveryCharge, setDeliveryCharge] = useState(null);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [discount, setDiscount] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [form] = Form.useForm();
  const [emptycart, SetemptyCart] = useState(true);
  // const [razorpapyLoading, setRazorpayLoading] = useState(false);
  const [Updatingloading, setupdatingloading] = useState(false);

  const [addressPhoneNumber, setAddressPhoneNumber] = useState("");
  // const [merchantUserId, setMerchantUserId] = useState("");
  // const [mobileNumber, setMobileNumber] = useState("");
  const [phonepeUrlLoading, setPhonepeUrlLoading] = useState(false);

  const { placingorderloading } = useSelector((state) => state.orders);

  const { addresses, addressloading, addresserror } = useSelector(
    (state) => state.address
  );
  const [adressLoading,setAdressLoading]=useState(false)

  console.log("addresses", addresses?.data);
  useEffect(() => {
    dispatch(fetchUserAddress({ apiurl, access_token }));
    dispatch(fetchCartItems({ apiurl, access_token }));
    dispatch(fetchUserDetails({ apiurl, access_token }));
  }, [access_token]);

  const countryCodes = [
    // { code: "+1", country: "United States" },
    // { code: "+44", country: "United Kingdom" },
    { code: "+91", country: "India" },
    // { code: "+81", country: "Japan" },
    // { code: "+61", country: "Australia" },
  ];

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
    setAdressLoading(true); // Show spinner

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
  } finally {
    setAdressLoading(false); // Hide spinner
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
      country_no: address.country_no,
      phone_no: address.phone_no,
    });
  };

  const fetchPincodeDetails = async (pincode) => {
    setPincodeLoading(true);
    try {
      setPincodeLoading(true);
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (!response.ok || !data || data[0].Status !== "Success") {
        message.error("I think pincode in address may wrong please check it");
      } else {
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
      message.error("Failed to fetch Pincode Details. Please try again.");
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
          if (pincode == 523357) {
            setDeliveryCharge(1);
          } else if (pincode >= 500001 && pincode <= 500099) {
            setDeliveryCharge(80);
          } else if (["andhrapradesh", "telangana"].includes(state)) {
            setDeliveryCharge(100);
          } else {
            setDeliveryCharge(120);
          }
        } else if (price > 5000 && price <= 10000) {
          if (pincode >= 500001 && pincode <= 500099) {
            setDeliveryCharge(160);
          } else if (["andhrapradesh", "telangana"].includes(state)) {
            setDeliveryCharge(200);
          } else {
            setDeliveryCharge(240);
          }
        } else if (price > 10000) {
          if (pincode >= 500001 && pincode <= 500099) {
            setDeliveryCharge(240);
          } else if (["andhrapradesh", "telangana"].includes(state)) {
            setDeliveryCharge(300);
          } else {
            setDeliveryCharge(360);
          }
        }
      }
    }
  }, [isPincode, items, pincodeDetails, pincode]);

  const handleQuantityChange = (id, value, productType, totalitem) => {
    if (Number(totalitem?.product?.stock_quantity) >= Number(value)) {
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
        let updatedQuantity = !totalitem?.product?.zero_p
          ? Math.floor(ChangeInIncrease)
          : ChangeInIncrease;

        const updateObj = {
          cart_item_id: id,
          quantity: updatedQuantity,
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
        let updatedQuantity = !totalitem?.product?.zero_p
          ? Math.floor(ChangeInDecrease)
          : ChangeInDecrease;

        const updateObj = {
          cart_item_id: id,
          quantity: -updatedQuantity,
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
    } else if (totalitem.product?.pre_book_eligible) {
      if (Number(totalitem.product?.pre_book_quantity) >= value) {
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
          let updatedQuantity = !totalitem?.product?.zero_p
            ? Math.floor(ChangeInIncrease)
            : ChangeInIncrease;

          const updateObj = {
            cart_item_id: id,
            quantity: updatedQuantity,
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
          let updatedQuantity = !totalitem?.product?.zero_p
            ? Math.floor(ChangeInDecrease)
            : ChangeInDecrease;

          const updateObj = {
            cart_item_id: id,
            quantity: -updatedQuantity,
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
      } else {
        const str = `${value} quantity exceeds the available stock. 
        Pre-booking stock: ${Number(totalitem.product?.pre_book_quantity)}, 
        Current stock: ${totalitem.product?.stock_quantity}.`;
        message.info(str);
      }
    } else {
      if (Number(totalitem?.product?.stock_quantity) <= 0) {
        message.info(" No stock available please remove this item  ");
      } else {
        const str = ` Available stock : ${Number(
          totalitem?.product?.stock_quantity
        )}  stock is exceeded not eligible for pre-book `;
        message.info(str);
      }
    }
  };

  useEffect(() => {
    if (cartItems?.length <= 0) {
      SetemptyCart(true);
    } else {
      SetemptyCart(false);
    }
    const updatedCartData = cartItems?.map((item) => ({
      key: item?.id,
      product: item?.item,
      color: item?.item?.color?.name,
      price: item?.item?.price,
      quantity: item?.quantity,
    }));
    setCartData(updatedCartData);
  }, [dispatch, cartItems]);

  useEffect(() => {
    if (cartItems?.length >= 0) {
      const updatedPrebookingArray = [];

      cartItems.forEach((item) => {
        const totalItem = item;
        const quantityNeeded = item.quantity;
        const itemId = item.id;

        if (Number(totalItem?.item?.stock_quantity) <= 0) {
          if (!totalItem?.item?.pre_book_eligible) {
            if (!outofStockArray.some((item) => item.id === itemId)) {
              outofStockArray.push(totalItem);
            }
          } else {
            if (Number(totalItem?.item?.pre_book_quantity) <= 0) {
              if (!outofStockArray.some((item) => item.id === itemId)) {
                outofStockArray.push(totalItem);
              }
            } else if (
              Number(totalItem?.item?.pre_book_quantity) >=
              Number(quantityNeeded)
            ) {
              const newItem = {
                id: itemId,
                itemname: totalItem.item.product,
                stock: Number(totalItem.item.stock_quantity),
                pre_book_quantity: totalItem?.item?.pre_book_quantity,
                pre_book_eligible: totalItem?.item?.pre_book_eligible,
                Totalstockneed: Number(quantityNeeded),
              };
              updatedPrebookingArray.push(newItem);
            } else {
              if (!reduceStockArray.some((item) => item.id === itemId)) {
                reduceStockArray.push(item);
              }
            }
          }
        } else if (
          Number(totalItem?.item?.stock_quantity) >= Number(quantityNeeded)
        ) {
        } else {
          if (totalItem?.item?.pre_book_eligible) {
            if (
              Number(totalItem?.item?.pre_book_quantity) >=
              Number(quantityNeeded)
            ) {
              const newItem = {
                id: itemId,
                itemname: totalItem.item.product,
                stock: Number(totalItem.item.stock_quantity),
                pre_book_quantity: totalItem?.item?.pre_book_quantity,
                pre_book_eligible: totalItem?.item?.pre_book_eligible,
                Totalstockneed: Number(quantityNeeded),
              };
              updatedPrebookingArray.push(newItem);
            } else if (Number(totalItem?.item?.pre_book_quantity) <= 0) {
              if (!reduceStockArray.some((item) => item.id === itemId)) {
                reduceStockArray.push(item);
              }
            } else {
              if (!reduceStockArray.some((item) => item.id === itemId)) {
                reduceStockArray.push(item);
              }
            }
          } else {
            if (!reduceStockArray.some((item) => item.id === itemId)) {
              reduceStockArray.push(item);
            }
          }
        }
      });

      setPrebookingarray((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(updatedPrebookingArray)) {
          return updatedPrebookingArray;
        }
        return prev;
      });
    }

    setPrebookingItemNames([]);
    setIsPrebooking(false);
  }, [cartItems]);

  if (pincodeLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "300px",
          marginBottom: "300px",
        }}
      >
        <Spin />
      </div>
    );
  }

  const handleRemoveNoStockItems = () => {
    Promise.all(
      outofStockArray.map((obj) => {
        const itemId = { cart_item_id: obj.id };
        return dispatch(removeCartItem({ apiurl, access_token, itemId }))
          .unwrap()
          .then(() => {
            setCartData((prevData) =>
              prevData.filter((row) => row.key !== obj.key)
            );
            setupdatingloading(true);
            return dispatch(fetchCartItems({ apiurl, access_token })).unwrap();
          });
      })
    )
      .then(() => {
        setupdatingloading(false);
        setOutofStockArray([]);
      })
      .catch((error) => {
        console.error("Error while removing out-of-stock items:", error);
      });

    setNoStockModel(false);
  };

  const handleReducingProducts = () => {
    reduceStockArray.forEach((obj) => {
      if (
        obj?.item?.stock_quantity !== undefined &&
        obj?.quantity !== undefined
      ) {
        const stockQuantity = parseFloat(obj.item.stock_quantity);
        const requestedQuantity = parseFloat(obj.quantity);

        if (stockQuantity <= 0) {
          if (!obj?.item?.pre_book_eligible) {
            const str = `Remove this product: ${obj?.item?.product}`;
            message.info(str);
          } else {
            const reduce =
              requestedQuantity - parseFloat(obj?.item?.pre_book_quantity || 0);
            handleDecrease(obj.id, reduce);
          }
        } else {
          const reduce = requestedQuantity - stockQuantity;
          handleDecrease(obj.id, reduce);
        }
      } else {
        console.warn("Invalid object format:", obj);
      }
    });

    setReduceStockModel(false);
    setReduceStockArray([]);
  };

  const handlePrebooking = () => {
    message.success("We Are proceeding with Pre-Booking quantity");
    setIsPrebooking(true);
    setPrebookingModel(false);
    prebookingarray.map((obj) => {
      storePrebookingItemsIds.push(obj.id);
      preBookingItemNames.push(obj.itemname);
    });
    next();
    setPrebookingarray([]);
  };

  storePrebookingItemsIds.map((obj) => {});
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

  const handleIncrease = (id, step, totalitem) => {
    console.log("totalitem", totalitem);
    if (
      Number(totalitem?.product?.stock_quantity) > Number(totalitem?.quantity)
    ) {
      const updateObj = {
        cart_item_id: id,
        quantity: step,
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
    } else if (totalitem.product?.pre_book_eligible) {
      if (
        Number(totalitem.product?.pre_book_quantity) >
        Number(totalitem?.quantity)
      ) {
        const updateObj = {
          cart_item_id: id,
          quantity: step,
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
      } else {
        const str = `${
          Number(totalitem?.quantity) + 1
        } quantity not with in pre booking stock : ${Number(
          totalitem.product?.pre_book_quantity
        )}   , Current stock ${Number(totalitem.product?.stock_quantity)} `;
        message.info(str);
      }
    } else {
      if (Number(totalitem?.product?.stock_quantity) <= 0) {
        message.info(" No stock available please remove this item  ");
      } else {
        message.info(" stock is exceeded not eligible for pre-book ");
      }
    }
  };

  const handleDecrease = (id, step) => {
    const updateObj = {
      cart_item_id: id,
      quantity: -step,
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
        const sizeexist =
          record.product.size && record.product.size !== ""
            ? record.product.size
            : null;
        const firstImage = product.images?.[0]?.image
          ? `${apiurl}${product.images[0].image}`
          : "no url is getting";
        return (
          <div className="product-row" align="middle">
            <div>
              <img src={firstImage} alt={product.name} />
            </div>
            <div>
              <p className="" style={{ marginBottom: "0px" }}>
                {product.product.length > 10
                  ? `${product.product.substring(0, 20)}...`
                  : product.product}
              </p>
              <p className="product-color">Color: {record.color}</p>

              {sizeexist ? (
                <p className="product-color">Size: {sizeexist}</p>
              ) : (
                ""
              )}
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

        const min = isFabric ? 1 : 1;
        const step = isFabric && record?.product?.zero_p ? 0.5 : 1;

        console.log(step);

        let updatedValue = quantity;

        return (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => handleDecrease(record.key, step)}
                style={{
                  padding: "5px 12px",
                  cursor: "pointer",
                  backgroundColor: "rgb(255 167 199)",
                  border: "1px solid #ccc",
                  color: "white",
                  borderRadius: "8px",
                }}
                disabled={updatedValue <= min}
              >
                -
              </button>
              <InputNumber
                controls={false}
                min={min}
                step={step}
                value={updatedValue}
                max={1000}
                onChange={(value) => {
                  updatedValue = value;
                }}
                onBlur={() => {
                  handleQuantityChange(
                    record.key,
                    updatedValue,
                    record.product.type,
                    record
                  );
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleQuantityChange(
                      record.key,
                      updatedValue,
                      record.product.type,
                      record
                    );
                  }
                }}
                className="quantity-input"
                style={{ width: "80px" }}
              />
              <button
                onClick={() => handleIncrease(record.key, step, record)}
                style={{
                  padding: "5px 10px",
                  cursor: "pointer",
                  color: "white",

                  border: "1px solid #ccc",
                  backgroundColor: "rgb(255 167 199)",
                  borderRadius: "8px",
                }}
                disabled={updatedValue >= 1000}
              >
                +
              </button>
              {isFabric && <span> meters</span>}
            </div>

            <Modal
              title={
                <span
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: "#f24c88",
                    textUnderlineOffset: "3px",
                  }}
                >
                  Pre Booking Products
                </span>
              }
              destroyOnClose
              onCancel={() => setPrebookingModel(false)}
              onClose={() => setPrebookingModel(false)}
              open={prebookingModel}
              footer={[
                <Button
                  key="submit"
                  type="primary"
                  style={{ backgroundColor: "#f24c88" }}
                  onClick={handlePrebooking}
                >
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
                      <strong>Product Name:</strong>{" "}
                      <b style={{ color: "#f24c88", fontWeight: "bolder" }}>
                        {item.itemname}
                      </b>
                    </p>

                    <p>
                      <strong>You have entered:</strong> {item.Totalstockneed}{" "}
                      pieces
                    </p>
                    <p>
                      <strong>Current stock available:</strong> {item.stock}
                    </p>
                    {item?.pre_book_eligible ? (
                      <p>
                        <strong>
                          Pre booking upto : {item.pre_book_quantity}
                        </strong>{" "}
                        {}
                      </p>
                    ) : (
                      ""
                    )}

                    {item?.pre_book_eligible ? (
                      <p>
                        <strong>Eligible for perbooking{}</strong> {}
                      </p>
                    ) : (
                      <p>
                        <strong>Not eligible for perbooking {}</strong> {}
                      </p>
                    )}

                    {}

                    {item.Totalstockneed >
                      item.pre_book_quantity + item.stock &&
                    item?.pre_book_eligible ? (
                      <p style={{ color: "#FF7F7F" }}>
                        <strong>Shortage For Pre_Book :</strong>{" "}
                        {item.Totalstockneed > item.pre_book_quantity
                          ? item.Totalstockneed - item.pre_book_quantity
                          : 0}{" "}
                        pieces
                      </p>
                    ) : (
                      ""
                    )}
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
          <>
            {isItemDiscount ? (
              <>
                <span style={{ textDecoration: "line-through", color: "red" }}>
                  ₹ {Number(record.product.price)}
                </span>
                <br />
                <span style={{ color: "green", fontWeight: "bold" }}>
                  ₹ {Number(record.product.discount_price)}
                </span>
              </>
            ) : (
              <>
                <span>₹ {Number(record.product.price)}</span>
              </>
            )}
            {isFabric && <span> per meter</span>}
          </>
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
        const sizeexist =
          record.product.size && record.product.size !== ""
            ? record.product.size
            : null;

        const firstImage = product.images?.[0]?.image
          ? `${apiurl}${product.images[0].image}`
          : "no url is getting";
        return (
          <div className="coloumn2-product-row" align="middle">
            <div>
              <img src={firstImage} alt={product.name} />
            </div>
            <div>
              <p className="" style={{ marginBottom: "0px" }}>
                {product.product.length > 10
                  ? `${product.product.substring(0, 10)}...`
                  : product.product}
              </p>

              <p className="product-color">Color: {record.color}</p>
              {sizeexist ? (
                <p className="product-color">Size: {sizeexist}</p>
              ) : null}
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

  const SelectAddress = (id) => {
    setSelectedAddress(id);
  };

  const handleShipping = () => {
    // console.log("clicking this function ");

    if (selectedAddress) {
      const matchedAddress = addresses?.data?.find(
        (address) => address.id === selectedAddress
      );

      if (matchedAddress?.phone_no) {
        setAddressPhoneNumber(matchedAddress?.phone_no);
        if (matchedAddress?.pincode) {
          setPincode(matchedAddress?.pincode);
          fetchPincodeDetails(matchedAddress?.pincode);
        }
      } else {
        message.error("Phone number is missing. Please update the address.");
      }
    }
  };

  const ProceedToCheckOut = () => {
    if (outofStockArray?.length > 0) {
      setNoStockModel(true);
    } else if (reduceStockArray?.length > 0) {
      setReduceStockModel(true);
    } else {
      setNoStockModel(false);
      if (prebookingarray?.length > 0) {
        setPrebookingModel(true);
      } else {
        next();
      }
    }
  };
  

  // add this to the testing order ProceedToCheckOut

  const handleTestingOrder = async () => {

    const productcolorIds = items?.items?.map((item) => item?.item?.id);

console.log("storePrebookingItemsIds",storePrebookingItemsIds)
console.log("prebook array ",prebookingarray)

      const colorIdsQuantity = items?.items?.map((item) => {
        console.log("itemmmm",item)
        const prebookingboolean = storePrebookingItemsIds.includes(item?.id);

        return {
          id: item?.item?.id,
          quantity: item?.quantity,
          prebookstock:item?.item?.pre_book_quantity,
          itemPreBookEligible:item?.item?.pre_book_eligible,
          prebookingboolean:prebookingboolean
        };
      });

      console.log("itemid and quantity", colorIdsQuantity);


    // const colorIdsQuantity =items?.items?.map(())

    // const colorIdsQuantity = items?.items?.map((item)=>item?.item?.id);
    const description = `price: ${items?.discounted_total_price}, ${items?.items
      ?.map((eachproduct) => {
        console.log("eachproduct", eachproduct);
        return `color: ${eachproduct?.item?.color?.name}, product Name: ${eachproduct?.item?.product}, Type : ${eachproduct?.item?.type}, quantity: ${eachproduct?.quantity}`;
      })
      .join("; ")}`;

    // console.log("description", description);
    // console.log("print", productcolorIds);
    // console.log("isPrebooking", isPrebooking);
    // console.log("selected Address", selectedAddress);
    // console.log("address phone number ", addressPhoneNumber);

    const paymentData = {
      amount: Number(items?.discounted_total_price) + Number(deliveryCharge),
      merchantUserId: user?.email,
      mobileNumber: addressPhoneNumber, // here I need to change the address number
      orderDetails: {
        total_discount_price: Number(items?.discounted_total_price),
        shipping_address: selectedAddress,
        shipping_charges: deliveryCharge,
        isPrebooking: isPrebooking,
        productcolorIds: productcolorIds,
        colorIdsQuantity:colorIdsQuantity,
        productsDiscription: description, // here i need to store the customer , email also 
      },
    };

    const url = `${apiurl}/phonepe/create_order/`;

    try {
      setPhonepeUrlLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const responseData = await response.json();
      console.log(responseData);

      if (responseData.success) {
        setPhonepeUrlLoading(false);

        // Show loading message before redirection
        document.body.innerHTML = `<h2 style="text-align:center; margin-top: 200px;">Redirecting to Payment...</h2>`;

        setTimeout(() => {
          window.location.href =
            responseData.data.instrumentResponse.redirectInfo.url;
        }, 1000);
        // Delay for better UX (optional)
      } else {
        setPhonepeUrlLoading(false);
        const msg=responseData.error;
       message.error(`Payment initiation failed: ${msg}`);
      }
    } catch (error) {
      setPhonepeUrlLoading(false);
      console.error("Payment error:", error);
      message.error(
        "Error occurred during payment initiation. Please try again."
      );
    }
  };

  // console.log("user", user);

  return (
    <>
      <div className="Whole_Cart">
        <img
          alt="cndu-prods-banner"
          className="banner"
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
              {emptycart ? (
                currentStep === 0 && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img
                      alt="cndu-empty-cart"
                      className="emptycarticon"
                      src={emptycartimg}
                    />
                  </div>
                )
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
                                        cursor: "pointer",
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

                                    {item?.phone_no ? (
                                      <p>
                                        <strong>Number:</strong> {item.phone_no}
                                      </p>
                                    ) : (
                                      <p>
                                        <strong>Number:</strong>{" "}
                                        <em>
                                          Not provided. Please add it using the
                                          Edit option below.
                                        </em>
                                      </p>
                                    )}
                                  </div>

                                  {/*  Here I Need To Add The Number  */}

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
                        {}
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
              {placingorderloading ? (
                <div
                  style={{
                    width: "80%",
                    margin: "0px auto",
                    display: "flex",
                    gap: "50px",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: "20px",
                  }}
                >
                  <h3> Please Wait Your Order Is Processing </h3>
                  <Spin />
                </div>
              ) : (
                currentStep === 2 && (
                  <div className="Row2">
                    {pincodeLoading ? (
                      <div className="centered-spinner">
                        <Spin />
                      </div>
                    ) : (
                      <div className="step3">
                        <div className="delivery-address-products">
                          <div className="delivery-address-card">
                            {isPrebooking ? (
                              <div className="flex-between">
                                <h4>Pre-Booking Estimated Delivery:</h4>
                                <h5>20-25 days</h5>
                              </div>
                            ) : (
                              <div className="header-line">
                                <h4>Estimated Delivery:</h4>
                                <h5>7-10 days</h5>
                              </div>
                            )}

                            {deliveryOption === "Home" ? (
                              <div className="header-line">
                                <h4>Delivery Address:</h4>
                                <h5>
                                  {
                                    addresses?.data?.find(
                                      (address) =>
                                        address.id === selectedAddress
                                    )?.address
                                  }
                                </h5>
                              </div>
                            ) : (
                              <div className="header-line">
                                <h4>Pickup In Store</h4>
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
                                level={5}
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "20px",
                                }}
                              >
                                Order Summary
                              </Title>
                            }
                            bordered
                          >
                            <div
                              style={{
                                marginTop: "20px",
                                display: "flex",
                                justifyContent: "space-between",
                                color: "red",
                              }}
                            >
                              <Text strong>Actual Total</Text>
                              <Text strong>₹ {total}</Text>
                            </div>

                            {discount && (
                              <div
                                className="flex-between"
                                style={{
                                  marginTop: "20px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text strong>Discount price</Text>
                                <Text style={{ color: "green" }}>
                                  - ₹{total - items?.discounted_total_price}
                                </Text>
                              </div>
                            )}

                            {deliveryCharge && (
                              <div
                                className="flex-between"
                                style={{
                                  marginTop: "20px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text strong>Delivery Charges</Text>
                                <Text>₹{deliveryCharge}</Text>
                              </div>
                            )}

                            <div
                              className="flex-between"
                              style={{
                                marginTop: "20px",
                                display: "flex",
                                justifyContent: "space-between",
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
                                phonepeUrlLoading || placingorderloading
                                  ? "Your order is being processed"
                                  : "Click to place your order"
                              }
                            >
                              <Button
                                onClick={handleTestingOrder}
                                className="Place_Order_button"
                                // loading={
                                //   phonepeUrlLoading || placingorderloading
                                // }
                                type="primary"
                                aria-label="Place Order"
                              >
                                {phonepeUrlLoading
                                  ? "Processing..."
                                  : "Place Order"}
                              </Button>
                            </Tooltip>
                          </Card>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}

              {currentStep === 2 && !pincodeLoading && !placingorderloading && (
                <>
                  <Button onClick={prev} primary>
                    Previous
                  </Button>
                </>
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
          confirmLoading={adressLoading}

        >
          {/* Here In This Model I need to Add The Number */}

          {/* problems I Am facing Issues showing the Number of the prevous Addresses */}

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

            <Form.Item
              name="country_no"
              label="country code"
              rules={[
                { required: true, message: "Please select your country code!" },
              ]}
              style={{ margin: 0, width: "200px" }}
            >
              <Select placeholder="Country Code">
                {countryCodes.map(({ code }) => (
                  <Select.Option key={code} value={code}>
                    {code}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="phone_no"
              label="Phone Number"
              rules={[
                { required: true, message: "Please input your phone number!" },
                {
                  validator: (_, value) => {
                    if (!value || value.length !== 10) {
                      return Promise.reject(
                        "Phone number must be exactly 10 digits!"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              style={{ margin: 0 }}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={
            <span
              style={{
                textDecoration: "underline",
                textDecorationColor: "#f24c88",
                textUnderlineOffset: "3px",
              }}
            >
              Out OF Stock Products
            </span>
          }
          destroyOnClose
          onCancel={() => setNoStockModel(false)}
          onClose={() => setNoStockModel(false)}
          open={noStockModel}
          footer={[
            <Button
              key="back"
              onClick={handleRemoveNoStockItems}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Remove
            </Button>,
          ]}
        >
          <div>
            We regret to inform you that these products have been purchased by
            other users. Please remove them from your cart. We appreciate your
            understanding!
          </div>
          {outofStockArray?.length > 0 ? (
            outofStockArray.map((obj, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <p>Product Name: {obj?.item?.product}</p>
              </div>
            ))
          ) : (
            <p>No items available for No-Stock.</p>
          )}
        </Modal>

        <Modal
          title={
            <span
              style={{
                textDecoration: "underline",
                textDecorationColor: "#f24c88",
                textUnderlineOffset: "3px",
              }}
            >
              Stock Reduced Products
            </span>
          }
          destroyOnClose
          onCancel={() => setReduceStockModel(false)}
          onClose={() => setReduceStockModel(false)}
          open={reduceStockModel}
          footer={[
            <Button
              key="back"
              onClick={handleReducingProducts}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Reduce
            </Button>,
          ]}
        >
          <div>
            "We’re sorry, these product's stock has been reduced as it was
            purchased by other users. Thank you for your understanding!"
          </div>
          {reduceStockArray?.length > 0 ? (
            reduceStockArray.map((obj, index) => (
              <div key={index}>
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  <p style={{ marginBottom: "0px" }}>
                    Product Name: {obj.item.product}
                  </p>
                  <p>Stock: {obj.item.stock_quantity}</p>
                  {obj.item.pre_book_eligible ? (
                    <p>Prebooking upto : {obj.item.pre_book_quantity}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No items available for No-Stock.</p>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Cart;
