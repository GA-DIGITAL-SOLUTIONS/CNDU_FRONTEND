import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { Button, Card, Spin } from "antd";
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
      <div
        style={{
          height: "30vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "50px",
          margin: "100px auto",
          textAlign: "center",
          width: "90%",
        }}
      >
        <h3>Your Payment Is Processing Please Don't Close The Tab</h3>
        <Spin />
      </div>
    );
  }

  return (
    <>
      <div style={{ width: "80%", height: "50vh", margin: "0px auto" }}>
        {data?.payment_record?.code === "PAYMENT_SUCCESS" ? (
          <div className="status-check-card">
            <h3>You Have successfully Placed the Order</h3>
            <Button onClick={() => Navigate("/profile?tab=Orders")}>
              Go to Orders
            </Button>
          </div>
        ) : errors.includes(data?.payment_record?.code) ? (
          <div className="status-check-card">
            <h3>YOUR PAYMENT IS FAILED</h3>
            <Button onClick={() => Navigate("/cart")}>Please try again</Button>
          </div>
        ) : (
          <div className="status-check-card">
            <h3>YOUR PAYMENT IS NOT DONE. PLEASE TRY AGAIN</h3>
          </div>
        )}
      </div>
      {/* <div>
        <h1>Phonepe Status</h1>
        <p>Transaction ID: {data?.payment_record?.marchant_transaction_id}</p>
        {data && (
          <div>
            <p>Payment status: {data?.payment_record?.status}</p>
            <p>Payment code: {data?.payment_record?.code}</p>
            <p>Payment Status Message: {data?.message}</p>
            <p>Payment amount: {data?.payment_record?.amount}</p>
          </div>
        )}
      </div> */}
    </>
  );
};

export default PhonepeStatus;
