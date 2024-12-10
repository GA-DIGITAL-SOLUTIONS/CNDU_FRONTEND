// userAddressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Example: Async thunk to fetch user address data (you can adjust to your API structure)
export const fetchUserAddress = createAsyncThunk(
  'userAddress/fetch',
  async ({ apiurl, access_token}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/address/`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
          }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user address');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add a user address
export const addUserAddress = createAsyncThunk(
  'userAddress/add',
  async ({ apiurl, access_token, addressData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/address/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, // Adding the access token
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error('Failed to add address');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const updateUserAddress = createAsyncThunk(
  'userAddress/update',
  async ({ apiurl, access_token, addressData,id}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/address/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, // Adding the access token
        },
        body: JSON.stringify({...addressData,id:id}),
      });

      if (!response.ok) {
        throw new Error('Failed to add address');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const deleteUserAddress = createAsyncThunk(
  'userAddress/delete',
  async ({ apiurl, access_token,id}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/address/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, // Adding the access token
        },
        body: JSON.stringify({id:id}),
      });

      if (!response.ok) {
        throw new Error('Failed to add address');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




// Create the slice
const userAddressSlice = createSlice({
  name: 'userAddress',
  initialState: {
    addresses: [],
    addressloading: false,
    addresserror: null,
  },
  reducers: {
    resetAddressState: (state) => {
      state.addresses = null;
      state.status = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAddress.pending, (state) => {
        state.addressloading=true
      })
      .addCase(fetchUserAddress.fulfilled, (state, action) => {
        state.addressloading=false
        state.addresses = action.payload;
      })
      .addCase(fetchUserAddress.rejected, (state, action) => {
        state.addressloading = false;
        state.addresserror = action.payload;
      })
      .addCase(addUserAddress.pending, (state) => {
        state.status = true;
      })
      .addCase(addUserAddress.fulfilled, (state, action) => {
        state.status = false;
        // state.address = action.payload;
        console.log("response is ",action.payload)

      })
      .addCase(addUserAddress.rejected, (state, action) => {
        state.status = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetAddressState } = userAddressSlice.actions;
export default userAddressSlice.reducer;
