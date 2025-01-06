import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';
import { useSelector } from 'react-redux';
import "./TrackOrder.css"

const TrackOrder = () => {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { apiurl } = useSelector((state) => state.auth);

  const fetchOrder = async (orderId) => {
    try {
      const response = await fetch(`${apiurl}/trackorder/?order_id=${orderId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      setError('Failed to fetch the order details.');
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!data) {
    return <p>Loading order details...</p>;
  }

  return (
    <div>
        <Header></Header>
      <div className='orderDetails'>
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> {data.orderNumber || 'N/A'}</p>
        <p><strong>Order Status:</strong> {data.orderStatus || 'N/A'}</p>
        <p><strong>Order Date:</strong> {data.orderedDate ? new Date(data.orderedDate).toLocaleString() : 'N/A'}</p>
        <p><strong>Expected Delivery Date:</strong> {data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Carrier:</strong> {data.carrierName || 'N/A'}</p>
        <p><strong>Tracking Number:</strong> {data.trackingNumber || 'N/A'}</p>

        <h3>Buyer Details</h3>
        <p><strong>Name:</strong> {data.buyerName || 'N/A'}</p>
        <p><strong>Phone:</strong> {data.buyerPhoneNum || 'N/A'}</p>
        <p><strong>Address:</strong></p>
        <p>{data.buyerAddressLine1 || ''}</p>
        <p>{data.buyerAddressLine2 || ''}</p>
        <p>{data.buyerAddressLine3 || ''}</p>
        <p>{data.buyerAddressLine4 || ''}</p>

        <h3>Tracking History</h3>
        {data.trackingDetails && data.trackingDetails.length > 0 ? (
          <ul>
            {data.trackingDetails.map((detail, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <p><strong>Status:</strong> {detail.scanStatus}</p>
                <p><strong>Location:</strong> {detail.scanLocation}</p>
                <p><strong>Date:</strong> {new Date(detail.scanDateTime).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tracking details available.</p>
        )}

        <h3>Sender Details</h3>
        <p><strong>City:</strong> {data.senderAddressCity || 'N/A'}</p>
        <p><strong>State:</strong> {data.senderAddressState || 'N/A'}</p>
      </div>
    </div>
  );
};

export default TrackOrder;
