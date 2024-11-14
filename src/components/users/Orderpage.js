import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../store/orderSlice';

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

  return (
    <div>
      <h1>Order Page</h1>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : order ? (
        <div>
          <h2>Order Details</h2>
          <p>{JSON.stringify(order)}</p>
        </div>
      ) : (
        <p>Loading order...</p>
      )}
    </div>
  );
};

export default Orderpage;
