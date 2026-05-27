import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { Button, Card, Spin } from "antd";
import { CheckCircleFilled, CloseCircleFilled, SyncOutlined } from "@ant-design/icons";
import "./Phonepay.css";

const PhonepeStatus = () => {
  const { marchant_trx_id } = useParams();
  const Navigate = useNavigate();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const [data, SetData] = useState(null);
  const [loading, SetLoading] = useState(false);

  const [errors, setErrors] = useState([
    "BAD_REQUEST",
    "AUTHORIZATION_FAILED",
    "PAYMENT_ERROR",
    "TRANSACTION_NOT_FOUND",
    "PAYMENT_DECLINED",
    "TIMED_OUT",
  ]);

  console.log("API URL:", apiurl);
  console.log("Access Token:", access_token);
  console.log("Marchant Transaction ID:", marchant_trx_id);

  useEffect(() => {
    handlePhonepeStatus();
  }, [marchant_trx_id]);

  const handlePhonepeStatus = async () => {
    try {
      SetLoading(true);
      const response = await fetch(`${apiurl}/payment/status/check/`, {
        method: "POST", // or 'GET' depending on the API specs
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          marchant_trx_id, // send the transaction ID in the body
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment status");
        SetLoading(false);
      }
      SetLoading(false);
      const data = await response.json();
      console.log("data",data)
      SetData(data);
      console.log("Payment status response data:", data);
      // Handle the response data here, like updating the state or UI
    } catch (error) {
      SetLoading(false);
      console.error("Error fetching payment status:", error);
    }
  };

  if (loading) {
    return (
      <div className="status-page-container">
        <div className="status-card-premium">
          <SyncOutlined spin className="status-icon-processing" />
          <h2 className="status-title">Processing Payment</h2>
          <p className="status-subtitle">
            Please wait while we confirm your payment securely. Do not close or refresh this tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="status-page-container">
        {data?.payment_record?.code === "PAYMENT_SUCCESS" ? (
          <div className="status-card-premium">
            <CheckCircleFilled className="status-icon-success" />
            <h2 className="status-title">Payment Successful!</h2>
            <p className="status-subtitle">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <Button className="status-action-btn" onClick={() => Navigate("/profile?tab=Orders")}>
              View Orders
            </Button>
          </div>
        ) : errors.includes(data?.payment_record?.code) ? (
          <div className="status-card-premium">
            <CloseCircleFilled className="status-icon-failure" />
            <h2 className="status-title">Payment Failed</h2>
            <p className="status-subtitle">
              Unfortunately, your payment could not be processed. Please try again or use a different payment method.
            </p>
            <Button className="status-action-btn" onClick={() => Navigate("/cart")}>
              Return to Cart
            </Button>
          </div>
        ) : (
          <div className="status-card-premium">
            <SyncOutlined spin className="status-icon-processing" style={{ color: "#faad14" }} />
            <h2 className="status-title">Payment Pending</h2>
            <p className="status-subtitle">
              Your payment is still being processed or could not be verified immediately. Please check your orders page later.
            </p>
            <Button className="status-action-btn" onClick={() => Navigate("/profile?tab=Orders")}>
              Go to Orders
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default PhonepeStatus;
