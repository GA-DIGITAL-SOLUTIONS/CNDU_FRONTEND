import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user details
export const fetchUserDetails = createAsyncThunk(
  'userInfo/fetch',
  async ({ apiurl, access_token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiurl}/user-details`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      return response.data.data; // Assuming the data is in the 'data' field
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create the slice
const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    user: {}, // User data object
    userdatasloading: true, // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null, // Error message (if any)
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.userdatasloading = true; // Set status to 'loading' when request is made
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userdatasloading = false; // Set status to 'succeeded' when request is successful
        state.user = action.payload; // Save the fetched user data in state
        console.log("user Payload", action.payload);
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.userdatasloading = false; // Set status to 'failed' if request fails
        state.error = action.payload; // Save error message in state
      });
  },
});

export default userInfoSlice.reducer;
