import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder,paymentStoring,paymentSuccess } from '../../store/paymentSlice';// reducer paymentSuccess please remember that 
import { Input, Button, Typography, Spin, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;


const PaymentForm = () => {
  const Navigate=useNavigate()

  const [amount, setAmount] = useState(5000); // amount in paise (₹50)

  const dispatch = useDispatch();

  const paymentState = useSelector((state) => state.payment);
  const {apiurl,access_token}=useSelector((state)=>state.auth)
  const { loading, error, success, order ,paymentResponse} = paymentState;
// console.log("paymentResponse",paymentResponse)

  // Use useEffect to trigger navigation once the payment response is available
  useEffect(() => {
    if (paymentResponse) {
      Navigate('/paymentSuccess');
      // console.log("here I need to send the request to the backend to store the data of the order");
      const PaymentData=paymentResponse
     dispatch(paymentStoring({apiurl,access_token,PaymentData}));
    } else {
      // console.log("pending or rejected");
    }
  }, [paymentResponse, Navigate]); // Run the effect when paymentResponse changes


  const handlePayment = () => {
    dispatch(createOrder({apiurl,access_token,amount})) // Dispatch createOrder action
  };


  if(success){
    // console.log("ameer")
    // console.log("true")
        const options = {
          key: process.env.RAZORPAY_PUBLIC_KEY,
          amount: order.amount,
          currency: order.currency,
          name: 'CNDU FARBRICS',
          description: 'Test Transaction',
          order_id: order.id,
          handler: function (response) {
            dispatch(paymentSuccess(response)); // Handle payment success
          },
          prefill: {
            name: 'ameer',
            email: 'ameerbasha2@gmail.com',
            contact: '7815869341',
          },
          theme: {
            color: '#3399cc',
          },
        };
         // Create Razorpay payment instance
        const paymentInstance = new window.Razorpay(options);
        paymentInstance.open();

  }


  const handleRazorpayPayment = async() => {
   
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
    <Title level={3}>Pay with Razorpay</Title>

    {loading && <Spin size="large" />}
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {success && <p style={{ color: 'green' }}>Payment Successful!</p>}

    <form onSubmit={(e) => e.preventDefault()}>
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in paise"
        style={{ marginBottom: 16 }}
      />
      <Button
        type="primary"
        onClick={handlePayment}
        loading={loading}
        style={{ width: '100%', marginBottom: 16 }}
      >
        Create Order
      </Button>
    </form>

    {order.id && (
      <Button
        type="default"
        onClick={handleRazorpayPayment}
        style={{ width: '100%' }}
      >
        Pay Now with Razorpay
      </Button>
    )}
  </div>
  );
};

export default PaymentForm;
