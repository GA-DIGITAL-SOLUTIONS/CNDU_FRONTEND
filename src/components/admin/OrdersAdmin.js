import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, removeOrder,returnOrder } from "../../store/orderSlice"; 

const OrdersAdmin = () => {
  
  const dispatch=useDispatch()

  const {apiurl,access_token}=useSelector((state)=>state.auth)

  useEffect(() => {
    dispatch(fetchOrders({ apiurl, access_token }));
  }, [dispatch, apiurl, access_token]);

  return (
    <div>

      <h1>Orders For Admin</h1>
    </div>
  )
}

export default OrdersAdmin