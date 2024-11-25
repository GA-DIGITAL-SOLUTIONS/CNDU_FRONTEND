import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { json, useNavigate } from 'react-router-dom';

// AsyncThunk to place an order
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async ({ apiurl, access_token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, // Authorization header
        },
       
      });

      if (!response.ok) {
        throw new Error('Failed to place the order');
      }

      const data = await response.json();
      return data; // Return the order data on success
    } catch (error) {
      return rejectWithValue(error.message); // Return error message on failure
    }
  }
);

// AsyncThunk to fetch placed orders
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async ({ apiurl, access_token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/orders/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, // Authorization header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      return data; // Return the fetched orders on success
    } catch (error) {
      return rejectWithValue(error.message); // Return error message on failure
    }
  }
);


export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async ({ apiurl, access_token, orderId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/orders/${orderId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, // Authorization header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order by ID');
      }

      const data = await response.json();
      return data; // Return the fetched order on success
    } catch (error) {
      return rejectWithValue(error.message); // Return error message on failure
    }
  }
);



// AsyncThunk to remove an order

export const removeOrder = createAsyncThunk(
  'order/removeOrder',
  async ({ apiurl, access_token, orderId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/orders/${orderId}/cancel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
        body:JSON.stringify({id:orderId})
      });

      if (!response.ok) {
        throw new Error('Failed to remove the order');
      }
      return orderId; 
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

// return order 


export const returnOrder = createAsyncThunk(
  'order/returnOrder',
  async ({ apiurl, access_token, orderId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/userreturn/${orderId}/`, { //
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, 
        },
        body:JSON.stringify({reason:"po raa nayana "})
      });

      if (!response.ok) {
        throw new Error('Failed to return  the order');
      }

      return orderId; 
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);


export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ apiurl, access_token, UpdatedStatus ,orderId}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/returns/${orderId}/`, { //
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${access_token}`, 
        },
        body:JSON.stringify({status:UpdatedStatus})
      });

      if (!response.ok) {
        throw new Error('Failed to return  the order');
      }

      return response; 
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);








// Slice to manage order state
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,  // To store the placed order details
    orders: [],   // To store the list of all placed orders
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle placing the order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Order is placed!");
        alert("You have successfully placed an order!");
        
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message


      })

      // Handle fetching placed orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        console.log("Fetched orders:", action.payload);
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
      })

      // Handle removing an order
      .addCase(removeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the order from the orders array based on the order ID
        state.orders = state.orders.filter(order => order.id !== action.payload);
        console.log("Order removed with ID:", action.payload);
      })
      .addCase(removeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
      });
  },
});

export default orderSlice.reducer;
