import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOrderById,returnOrder,fetchOrders } from '../../store/orderSlice';

const Orderpage = () => {
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  const dispatch = useDispatch();
  const orderId = id;

  useEffect(() => {
    if (apiurl && access_token && orderId) {
      dispatch(fetchOrderById({ apiurl, access_token, orderId }))
        .unwrap()
        .then((data) => {
          setOrder(data); // Save order data on success
          setError(null); // Clear any previous errors
        })
        .catch((err) => {
          setError(err); // Set error message on failure
        });
    }
  }, [dispatch, apiurl, access_token, orderId]);


  const handleReturnOrder=(orderId)=>{
    console.log("return chay raa e order ni ",orderId)
    dispatch(returnOrder({ apiurl, access_token,orderId}))
    .unwrap()
    .then(()=>{
      dispatch(fetchOrders({ apiurl, access_token }));
      console.log("successfully sent request for return ")
    }).catch((error) => {
      console.error("Error in returning the order:", error);
    });
  } 
  return (
    <div>
      <h1>Order Page for the user </h1>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : order ? (
        <div>
          <h2>total order id :{order.id}</h2>
          <h2>amount:{order.total_amount}</h2>
          <h2>user:{order.user}</h2>
          {order.items.map((item)=>{
            return <div>
              <h1>item:{item.id}</h1>
              <button onClick={() => { handleReturnOrder(item.id) }}>Return</button>
              </div>
          })}
        </div>
      ) : (
        <p>Loading order...</p>
      )}
    </div>
  );
};

export default Orderpage;
