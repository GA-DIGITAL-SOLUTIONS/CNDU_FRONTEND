import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for creating a discount
export const createDiscount = createAsyncThunk(
  'discounts/createDiscount',
  async ({apiurl,access_token,formData}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/discounts/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, 
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to create discount');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDiscounts = createAsyncThunk(
  'discounts/fetchDiscounts',
  async ({apiurl,access_token}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/discounts/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`, 
        },
      });
      if (!response.ok) {
        throw new Error('Failed to create discount');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const discountsSlice = createSlice({
  name: 'discounts',
  initialState: {
    discounts: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add additional reducers for other actions if needed
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts.push(action.payload); // Add the newly created discount to the list
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = discountsSlice.actions;

export default discountsSlice.reducer;
