import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../Header/Header';
import { House, AlertOctagon } from 'lucide-react';
import './TrackOrder.css';
import Loader from '../../Loader/Loader';

const TrackOrder = () => {
    const { orderId } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const { apiurl } = useSelector((state) => state.auth);
    const [newOrderId, setNewOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchOrder = async (orderId) => {
        setLoading(true)
        setData(null)
        setError(null)
        try {
            const response = await fetch(`${apiurl}/trackorder/?order_id=${orderId}`, {
                method: 'GET',
            });

            if (!response.ok) {
                setLoading(false);
                throw new Error('Order not found');
            }

            const result = await response.json();
            // console.log(result.data)
            setData(result.data);
            if (result.data === null) {
                setError("enter the correct track id")
            }
            setError(null); // Clear any previous error
        } catch (error) {
            setData(null); // Clear previous data
            setError('Order not found. Please enter a correct tracking ID.');
            console.error('Error fetching data:', error);
        }
        setLoading(false)
    };

    useEffect(() => {
        if (orderId) {
            fetchOrder(orderId);
        }
    }, [orderId]);

    const formatDay = (date)=>{
        let day = new Date(date).toLocaleDateString('en-US',{
            weekday:'long'
        })
        return day.slice(0,3)
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
          day: 'numeric',  // e.g., 1
          month: 'long',   // e.g., January
          year: 'numeric', // e.g., 2025
        });
      };

    const formatTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'UTC',
        });
    };

    return (
        <div className="track-order-container">
            {loading && <Loader />}
            <Header />
            <div className="goBack">
                <button onClick={() => navigate('/')}><House /> Back to Home</button>
            </div>

            {error && (
                <div className="error-message">
                    <AlertOctagon size={48} color="red" />
                    <p>Order not found. Please enter a correct tracking ID.</p>
                </div>
            )}

            {data ? (
                <>
                    <div className="order-status flex">
                        <div className='arriving-status'>
                            {/* <h2>Arriving tomorrow by 10 PM</h2> */}
                            <div className="track-content">
                                <div className="content1">
                                    <p>Tracking ID: {data.trackingNumber}</p>
                                    <p>
                                        <strong>Order Number:</strong> {data.orderNumber || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Carrier:</strong> {data.carrierName || 'N/A'}
                                    </p>
                                </div>
                                <div className="content2">
                                    <h3>Delivery Address: <span style={{fontWeight:'300'}}>{data.buyerName || 'N/A'}</span></h3>
                                    {/* <p>{data.buyerName || 'N/A'}</p> */}
                                    <p>{data.buyerAddressLine1 || ''}</p>
                                    <p>{data.buyerAddressLine2 || ''} - {data.buyerPhoneNum || 'N/A'}</p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tracking-timeline">
                        {data.trackingDetails &&
                            data.trackingDetails.map((detail, index) => (
                                <div key={index} className="timeline-item">
                                    <div className="date-time">
                                        <div className="timeline-date">
                                            <div className="timeline-data">{formatDate(detail.scanDateTime)}</div>
                                            {/* <div className="timeline-day">{formatDay(detail.scanDateTime)}</div>  */}
                                        </div>
                                        <div className="timeline-time"> {formatDay(detail.scanDateTime)} -- {formatTime(detail.scanDateTime)}</div>
                                    </div>
                                    <div className="timeline-content">
                                        <div>{detail.scanStatus}</div>
                                        <div className="timeline-location">{detail.scanLocation}</div>
                                    </div>
                                </div>
                            ))}
                    </div>

                </>
            ) : (
                !loading && !error && (
                    <div className="no-data-message error-message">
                        <AlertOctagon size={48} color="red" />
                        <p style={{ marginBottom: '0px' }}>Order not found. Please enter a correct order ID.</p>
                    </div>
                )
            )}
        </div>
    );
};

export default TrackOrder;
