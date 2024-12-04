import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user details
export const fetchUserDetails = createAsyncThunk(
  'userInfo/fetch',
  async ({ apiurl ,access_token}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiurl}/user-details`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      return response.data.data; // Assuming the data is in 'data' field
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create the slice
const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    user: {},
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },

   
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // state.user = action.payload; // Set the fetched user data
        state.user=action.payload
console.log("user Payload",action.payload)
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userInfoSlice.reducer;
