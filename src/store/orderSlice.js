import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// AsyncThunk to place an order
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ apiurl, access_token, Obj }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(Obj),
      });
      if (!response.ok) {
        throw new Error("Failed to place the order");
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
  "order/fetchOrders",
  async ({ apiurl, access_token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/orders/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      return data; // Return the fetched orders on success
    } catch (error) {
      return rejectWithValue(error.message); // Return error message on failure
    }
  }
);

// AsyncThunk to fetch order by ID
export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async ({ apiurl, access_token, orderId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/orders/${orderId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order by ID");
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
  "order/removeOrder",
  async ({ apiurl, access_token, orderId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/orders/${orderId}/cancel/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ id: orderId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove the order");
      }
      return orderId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// AsyncThunk to remove an order
export const removeOrderItem = createAsyncThunk(
  "order/removeOrderItem",
  async ({ apiurl, access_token, orderId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/ordersitem/${orderId}/cancel/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ id: orderId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove the order");
      }
      return orderId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const returnOrder = createAsyncThunk(
  "order/returnOrder",
  async ({ apiurl, access_token, array, textarea }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/returns/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ order_ids: array, reason: textarea }),
      });

      // If response is not OK, handle the error before parsing JSON
      if (!response.ok) {
        const errorData = await response.json();  // Parse error response JSON
        console.log("Error Data:", errorData);
        // Reject with the error message from the backend
        // return rejectWithValue(errorData.error); // Use the error message from the backend
        return errorData
      }

      // Parse and return the successful response
      const data = await response.json();
      console.log("Response Data:", data);
      return data;  // Return successful response data
    } catch (error) {
      const data = await error.json();
      console.log("error data",data)
      // Log and send the error message back
      // console.error("Fetch Error:", error);
      // return rejectWithValue(error.message || "Something went wrong");
    }
  }
);


// Updated AsyncThunk for updating order status (returns only serializable data)
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async (
    { apiurl, access_token, UpdatedStatus, orderId },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${apiurl}/orders/${orderId}/update-status/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({ status: UpdatedStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the order status");
      }

      const data = await response.json(); // Only return serializable data
      return data; // Return the response data on success
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Updated AsyncThunk for updating return status (returns only serializable data)
export const updateReturnStatus = createAsyncThunk(
  "order/updateReturnStatus",
  async (
    { apiurl, access_token, UpdatedStatus, orderId },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${apiurl}/returns/${orderId}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ status: UpdatedStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the return status");
      }

      const data = await response.json(); // Only return serializable data
      return data; // Return the response data on success
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice to manage order state
const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    orders: [],
    SingleOrderloading: false,
    SingleOrdererror: null,
    SingleOrder: {},
    OrderStatus: "",
    removeOrderItemloading: false,
    removeOrderItemerror: false,
    placingorderloading: false,
    placingordererror: null,
    fetchOrdersloading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.SingleOrderloading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.SingleOrder = action.payload;
        state.SingleOrderloading = false;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.SingleOrderloading = false;
        state.SingleOrdererror = action.payload;
      })

      .addCase(placeOrder.pending, (state) => {
        state.placingorderloading = true;

        state.placingordererror = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingorderloading = false;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingorderloading = false;
        state.placingordererror = action.payload;
      })

      // Handle fetching placed orders
      .addCase(fetchOrders.pending, (state) => {
        state.fetchOrdersloading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.fetchOrdersloading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.fetchOrdersloading = false;
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
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload
        );
      })
      .addCase(removeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
      })
      .addCase(removeOrderItem.pending, (state) => {
        state.removeOrderItemloading = true;
        state.removeOrderItemerror = null;
      })
      .addCase(removeOrderItem.fulfilled, (state, action) => {
        state.removeOrderItemloading = false;
        // console.log(action.payload)
        // Remove the order from the orders array based on the order ID
        // state.SingleOrder = state.orders.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeOrderItem.rejected, (state, action) => {
        state.removeOrderItemloading = false;
        state.removeOrderItemerror = action.payload; // Store error message
      });
  },
});

export default orderSlice.reducer;
