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


export const updateUserProfile = createAsyncThunk(
  'updateUserProfile/fetch',
  async ({ apiurl, access_token, data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiurl}/update-profile/`,
        JSON.stringify(data), 
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data; 
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
    userdatasloading: true, 
    updateprofileloading:false,
    updateprofileloading:null,
    userdataerror: null, 
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.userdatasloading = true; // Set status to 'loading' when request is made
        state.userdataerror=null
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userdatasloading = false; // Set status to 'succeeded' when request is successful
        state.user = action.payload; // Save the fetched user data in state
        console.log("user Payload", action.payload);
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.userdatasloading = false; // Set status to 'failed' if request fails
        state.userdataerror = action.payload; // Save error message in state
        
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updateprofileloading = true; // Set status to 'loading' when request is made
        state.updateprofileloading=null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateprofileloading = false; // Set status to 'succeeded' when request is successful
        state.update = action.payload; // Save the fetched user data in state
        console.log("user Payload", action.payload);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateprofileloading = false; // Set status to 'failed' if request fails
        state.updateprofileloading = action.payload; // Save error message in state
        
      });
  },
});

export default userInfoSlice.reducer;
