// src/store/passwordSlice.js
import { createSlice, createAsyncThunk  } from "@reduxjs/toolkit";
import useSelection from "antd/es/table/hooks/useSelection";
import { useSelector } from "react-redux";
// import { apiCall } from "../utils/api"; // A helper function to make API calls

const apiurl = process.env.REACT_APP_API_URL;// this is the backend url try to put it in the store 


const initialState = {
  loading: false,
  error: null,
  message: null,
};

// Forgot Password Action
export const resetPassword = createAsyncThunk(
  "password/resetPassword",
  async ({ uidb64, token, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${apiurl}/reset-password/${uidb64}/${token}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to reset password");
      }

      const data = await response.json();
      return data.message;  // Return success message
    } catch (error) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  }
);



// Change Password Action
export const changePassword = createAsyncThunk(
  "password/changePassword",
  async ({ currentPassword, newPassword , confirmPassword,access_token}, { rejectWithValue }) => {
   
    try {
      const response = await fetch(`${apiurl}/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`, 
        },
        body: JSON.stringify({ currentPassword, newPassword ,confirmPassword}),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// forgot

export const forgotPassword = createAsyncThunk(
  "password/forgotPassword",
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      const data = await response.json();


      if (!response.ok) {
        throw new Error(data.error || "Failed to send password reset request");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default passwordSlice.reducer;
