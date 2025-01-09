import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ apiurl, access_token, amount ,productcolorIds,isPrebooking}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/create_order/`, {
        // here add apiurl
        method: "POST",
        headers: {
          Authorization: `BEARER ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
          productcolorIds:productcolorIds,
          isPrebooking:isPrebooking,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      return data.order; // Returning the order data from the response
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
// payment storing after successfully completed the payment and order
export const paymentStoring = createAsyncThunk(
  "payment/paymentStoring",
  async ({ apiurl, access_token, PaymentResponsera }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/payment_success/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(PaymentResponsera), // I think change the backend for access_token
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.order; // Returning the order data from the response
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    order: {},
    loading: false,
    error: null,
    orderCreated: false,
    paymentResponse: null,
    RazorpaySuccess: false,
  },
  reducers: {
    paymentSuccess: (state, action) => {
      state.success = true;
      state.paymentResponse = action.payload;
      console.log(state.paymentResponse)
    },
    toggleOrder: (state, action) => {
      console.log(action, state);
      console.log(state.orderCreated)
      state.orderCreated = action.payload;
      console.log(state.orderCreated)
    },
    toggleSuccess:(state,action)=>{
      console.log(state.RazorpaySuccess)
      state.RazorpaySuccess = action.payload; 
      console.log(state.RazorpaySuccess)
    },
    toggleResponse:(state,action)=>{
      console.log("first",state.paymentResponse)
      state.paymentResponse = action.payload; 
      console.log("after",state.RazorpaySuccess)

    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous error
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        console.log("order is createed", action.payload);
        state.orderCreated = true; // Mark success when order is created
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Handle errors
      })
      .addCase(paymentStoring.pending, (state) => {
        // state.loading = true;
        // state.error = null;  // Reset any previous error
      })
      .addCase(paymentStoring.fulfilled, (state, action) => {
        state.RazorpaySuccess = true;
        // state.loading = false;
        // state.order = action.payload;
        // console.log("order is createed",action.payload);
        // state.success = true;  // Mark success when order is created
      })
      .addCase(paymentStoring.rejected, (state, action) => {
        // state.loading = false;
        // state.error = action.payload;  // Handle errors
      });
  },
});

export const { paymentSuccess, toggleOrder ,toggleSuccess,toggleResponse} = paymentSlice.actions;
export default paymentSlice.reducer;
