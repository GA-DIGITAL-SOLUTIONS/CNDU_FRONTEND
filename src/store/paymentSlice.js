import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createOrder = createAsyncThunk(
  'payment/createOrder',
  async ({apiurl,access_token,amount}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/create_order/`, {  // here add apiurl
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          amount,
          currency: 'INR',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.order;  // Returning the order data from the response
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);



// payment storing after successfully completed the payment and order
export const paymentStoring = createAsyncThunk(
  'payment/paymentStoring',
  async ({apiurl,access_token,PaymentData}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/payment_success/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify(PaymentData), // I think change the backend for access_token
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.order;  // Returning the order data from the response
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    order: {},
    loading: false,
    error: null,
    success: false,
    paymentResponse: null,

  },
  reducers: {
    paymentSuccess: (state, action) => {
      state.success = true;
      state.paymentResponse = action.payload;
      // console.log("payment,",action.payload)
      // if(state.paymentResponse){
      //   console.log("redirect to one url  / paymentSuccess")
      // }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;  // Reset any previous error
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        console.log("order is createed",action.payload);
        state.success = true;  // Mark success when order is created
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // Handle errors
      });
  },
});

export const { paymentSuccess } = paymentSlice.actions;
export default paymentSlice.reducer;
